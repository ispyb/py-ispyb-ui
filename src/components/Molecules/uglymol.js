import { Viewer, makeLabel } from 'uglymol/uglymol';
import { Vector3 } from 'three';

var auto_speed = 1.0;

//Fix rotation

Viewer.prototype.relX = function relX(evt /*:MouseEvent*/) {
  return (2 * evt.offsetX) / this.window_size[0] - 1;
};

Viewer.prototype.relY = function relY(evt /*:MouseEvent*/) {
  return 1 - (2 * evt.offsetY) / this.window_size[1];
};

// Implement peak cycling

class ViewerPatch extends Viewer {
  peaks = undefined;

  constructor(config) {
    super(config);
    this.add_real_space_key_bindings();
    this.hud('Press H for help.');
  }

  load_peaks(peaksUrl, callback) {
    super.load_file(
      peaksUrl,
      { binary: false },
      function (req) {
        this.peaks = req.responseText
          .split('\n')
          .slice(1, req.responseText.split('\n').length)
          .map(function (row) {
            return row.split(',').map(function (col) {
              return parseFloat(col);
            });
          });
        this.peakIndex = -1;
        if (callback) callback();
      }.bind(this)
    );
  }

  cycle_peaks(direction) {
    if (this.peaks === undefined || this.peaks.length === 0) {
      this.hud('No peak available.');
      return;
    }
    if (this.peakIndex === -1) {
      this.peakIndex = 0;
    } else {
      this.peakIndex = this.peakIndex + direction;
      if (this.peakIndex > this.peaks.length - 2) {
        this.peakIndex = 0;
      } else if (this.peakIndex < 0) {
        this.peakIndex = this.peaks.length - 2;
      }
    }
    var peakXYZ = this.peaks[this.peakIndex].slice(0, 3);
    const targ = new Vector3(...peakXYZ);
    this.controls.go_to(targ, null, null, 60 / auto_speed);
    var text = this.peaks[this.peakIndex][3].toString();
    var is_shown = this.peakIndex in this.labels;
    if (!is_shown) {
      var label = makeLabel(text, {
        pos: peakXYZ,
        font: this.config.label_font,
        color: '#' + this.config.colors.fg.getHexString(),
        win_size: this.window_size,
        z_shift: 0.2,
      });
      this.labels[this.peakIndex] = label;
      this.scene.add(label);
    }
  }

  add_real_space_key_bindings() {
    var kb = this.key_bindings;
    // a
    kb[65] = function (evt) {
      evt.shiftKey ? this.cycle_peaks(-1) : this.cycle_peaks(1);
    }.bind(this);
  }

  KEYBOARD_HELP = super.KEYBOARD_HELP + '\n(Shift+)A = cycle through peaks';
}

export { ViewerPatch as Viewer };
