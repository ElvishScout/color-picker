import "./style.css";

const hues = [0, 30, 45, 60, 75, 120, 150, 180, 195, 210, 240, 270, 285, 300, 315, 330];
const sats = [100, 75, 50, 30, 15, 0];
const ltns = [0, 20, 40, 50, 70, 80, 90, 100];

let curHue: number;
let curSat: number;
let curLtn: number;

let elems: HTMLElement[] = [];
let colorInput: HTMLInputElement;

let colorSelect = new Event("colorSelect");

let picker = document.querySelector(".color-picker") as HTMLDivElement;

function select(hue: number, sat: number, ltn: number) {
  curHue = hue;
  curSat = sat;
  curLtn = ltn;
  for (let elem of elems) {
    elem.dispatchEvent(colorSelect);
  }
}

function hslToHex(hsl: [number, number, number]) {
  let h = hsl[0] / 360;
  let s = hsl[1] / 100;
  let l = hsl[2] / 100;
  let t1, t2, t3;
  let val;

  let hex = 0;
  if (s === 0) {
    val = Math.round(l * 255);
    hex = (val << 16) | (val << 8) | val;
  } else {
    t2 = l < 0.5 ? l * (1 + s) : l + s - l * s;
    t1 = 2 * l - t2;

    for (let i = 0; i < 3; i++) {
      t3 = h + (1 / 3) * -(i - 1);
      t3 < 0 && t3++;
      t3 > 1 && t3--;
      val = Math.round(
        (6 * t3 < 1 ? t1 + (t2 - t1) * 6 * t3 : 2 * t3 < 1 ? t2 : 3 * t3 < 2 ? t1 + (t2 - t1) * (2 / 3 - t3) * 6 : t1) *
          255
      );
      hex = (hex << 8) | val;
    }
  }
  return hex.toString(16).padStart(6, "0");
}

for (let sat of sats) {
  let row = document.createElement("div");
  row.className = "row";

  for (let hue of hues) {
    let cell = document.createElement("div");
    cell.className = "cell";

    cell.addEventListener("colorSelect", () => {
      cell.style.backgroundColor = `#${hslToHex([hue, sat, curLtn])}`;
      cell.title = `#${hslToHex([hue, sat, curLtn]).toLowerCase()}`;
      if (sat === curSat && hue === curHue) {
        cell.classList.add("selected");
      } else {
        cell.classList.remove("selected");
      }
    });

    cell.onmousedown = cell.onmouseover = (ev) => {
      if (ev.buttons === 1) {
        select(hue, sat, curLtn);
      }
    };

    elems.push(cell);
    row.append(cell);
  }
  picker.append(row);
}

{
  let row = document.createElement("div");
  row.className = "row";

  for (let ltn of ltns) {
    let cell = document.createElement("div");
    cell.className = "cell cell-ltn";

    cell.addEventListener("colorSelect", () => {
      cell.style.backgroundColor = `#${hslToHex([curHue, curSat, ltn])}`;
      cell.title = `#${hslToHex([curHue, curSat, ltn]).toLowerCase()}`;
      if (ltn === curLtn) {
        cell.classList.add("selected");
      } else {
        cell.classList.remove("selected");
      }
    });

    cell.onmousedown = cell.onmouseover = (ev) => {
      if (ev.buttons === 1) {
        select(curHue, curSat, ltn);
      }
    };

    elems.push(cell);
    row.append(cell);
  }
  picker.append(row);
}

{
  let row = document.createElement("div");
  row.className = "row";

  let entry = document.createElement("input");
  entry.className = "color-value";
  entry.type = "text";
  entry.readOnly = true;

  entry.addEventListener("colorSelect", () => {
    entry.value = `#${hslToHex([curHue, curSat, curLtn]).toLowerCase()}`;
  });

  colorInput = entry;
  elems.push(entry);
  row.append(entry);

  let button = document.createElement("input");
  button.className = "copy-button";
  button.type = "button";
  button.value = "Copy";
  button.onclick = () => {
    entry.focus();
    entry.select();
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(colorInput.value);
    } else {
      document.execCommand("copy");
    }
  };

  row.append(button);

  picker.append(row);
}

select(0, 100, 50);
