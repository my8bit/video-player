// TODO finish refactoring
class SourceBuffer {
  constructor(buffer, http) {
    this.buffer = buffer;
    this.http = http;
    this.chunk = 1;
  }

  init (url) {
    this.http
      .get(url, {
        responseType: 'arraybuffer'
      })
      .success(this.append);
  }

  append(data) {
    this.buffer.appendBuffer(new Uint8Array(data));
    this.buffer.addEventListener('updateend', this.updateEnd, false);
  }

  updateEnd() {
  }

  loadSegment (url) {
    this.http
      .get(url, {
        responseType: 'arraybuffer'
      })
      .success(data => {
        if (this.chunk < 9) { //TODO remove hardcodede magic number
          this.chunk++;
          this.append(data);
        }
      });
  }
}

export class StreamService {
  /** @ngInject */
  constructor($http) {
    this.http = $http;
  }

  play() {
    const active = this.getActive();
    const src = this.getMediaSourceURL();
    this.changeSrc(src);
    this.fetchMPD(active.src);
  }

  getMediaSourceURL() {
    const mediaSource = new MediaSource();
    mediaSource.addEventListener('sourceopen', this.sourceOpen.bind(this, mediaSource));
    return window.URL.createObjectURL(mediaSource);
  }

  sourceOpen(mediaSource) {
    // TODO Fix this hardcode
    this.sourceBuffer = mediaSource.addSourceBuffer('video/mp4; codecs="avc3.64001f"');
  }

  startStream(mpdParams) {
    const initTemplate = mpdParams.segmentTemplate.getAttribute('initialization');
    // TODO fix magic number
    const id = mpdParams.representation[2].getAttribute('id');
    const initUrl = initTemplate.replace('$RepresentationID$', id);
    let url;
    let baseSegmentUrl;
    // TODO hardcodede logic - fix this
    if (!mpdParams.videoBaseUrl) {
      url = mpdParams.videoBaseUrl = 'http://demo.unified-streaming.com/video/ateam/ateam.ism/' + initUrl;
      baseSegmentUrl = mpdParams.videoBaseUrl;
    } else {
      url = mpdParams.baseUrl + mpdParams.videoBaseUrl + initUrl;
      baseSegmentUrl = mpdParams.baseUrl + mpdParams.videoBaseUrl;
    }
    const self = this;
    // TODO fix chunchs mechanizm
    let chunk = 1;
    const updateEnd = () => {
      loadSegment(
          baseSegmentUrl +
          mpdParams.media.replace('$RepresentationID$', id).replace('$Number%06d$', '00000' + chunk)
      );
    };
    const loadSegment = (url) => {
      self.http
      .get(url, {
        responseType: 'arraybuffer'
      })
      .success(data => {
        if (chunk < 9) { //TODO remove hardcodede magic number
          chunk++;
          self.sourceBuffer.appendBuffer(new Uint8Array(data));
          self.sourceBuffer.addEventListener('updateend', updateEnd, false);
        }
      });
    };

    this.http
      .get(url, {
        responseType: 'arraybuffer'
      })
      .success(data => {
        self.sourceBuffer.appendBuffer(new Uint8Array(data));
        self.sourceBuffer.addEventListener('updateend', updateEnd, false);
      });
  }

  fetchMPD(url) {
    this.http
      .get(url)
      .success(data => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(data, 'application/xml');
        const mpdParams = this.getMPDattrs(xml);
        this.startStream(mpdParams);
      });
  }

  setCommands(play, pause) {
    this.pplayerPlay = play;
    this.playerPause = pause;
  }

  getMPDattrs(xmlDoc) {
    const representation = xmlDoc.querySelectorAll('AdaptationSet[mimeType="video/mp4"] Representation');
    const period = xmlDoc.querySelectorAll('Period');
    const segmentTemplate = xmlDoc.querySelector('AdaptationSet[mimeType="video/mp4"]  SegmentTemplate');
    
    return {
      baseUrl: xmlDoc.querySelector('MPD BaseURL').textContent,
      videoBaseUrl: (xmlDoc.querySelector('AdaptationSet[mimeType="video/mp4"] BaseURL') || {}).textContent,
      representation,
      segmentTemplate,
      media: segmentTemplate.getAttribute('media'),
      initialization: segmentTemplate.getAttribute('initialization'),
      period,
      vidTempDuration: period[0].getAttribute('duration'),
      segList: xmlDoc.querySelectorAll('SegmentList')
    };
  }

  onChange(cb) {
    this.changeSrc = cb;
  }

  setActive(id) {
    this.active = this.getVideos()[parseInt(id[0], 10) - 1 || 0];
  }

  getActive() {
    return this.active || this.getVideos()[0];
  }

  getVideos() {
    return [{
      src: 'http://demo.unified-streaming.com/video/ateam/ateam.ism/ateam.mpd',
      id: '1'
    }, {
      src: 'http://rdmedia.bbc.co.uk/dash/ondemand/testcard/1/client_manifest-events.mpd',
      id: '2'
    }];
  }
}
