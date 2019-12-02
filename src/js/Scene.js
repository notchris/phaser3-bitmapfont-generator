import Phaser from 'phaser';
const js2xmlparser = require("js2xmlparser");

export default class Main extends Phaser.Scene {
    constructor() {
        super({
            key: 'Main',
        });
    }

    preload() {

    }

    generateFont() {

        // Generate Font
        const testString = "Hello World!";
        const fontFamily = document.querySelector('#fontFamily').value;
        const fontSize = parseInt(document.querySelector('#fontSize').value);
        const fontColor = document.querySelector('#fontColor').value;

        const container = this.add.container(0, 0, []);
        container.setSize(512, 512);
        const charArray = [];
        const charString = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~';
        for (let i = 0; i < charString.length; i += 1) {
            charArray.push(charString[i]);
        }
        const objArray = [];
        const widthArray = [];
        const heightArray = [];
        charArray.forEach((char) => {
            const obj = this.add.text(0,0,char, {
                fontFamily: fontFamily,
                fontSize: fontSize + 'px',
                color: fontColor
            });
            widthArray.push(obj.width);
            heightArray.push(obj.height);
            objArray.push(obj);
        });

        container.add(objArray);

        let maxWidth = Math.max(...widthArray);
        let maxHeight = Math.max(...heightArray);

        Phaser.Actions.GridAlign(objArray, {
            width: 10,
            height: 12,
            cellWidth: maxWidth,
            cellHeight: maxHeight,
            position: Phaser.Display.Align.TOP_LEFT,
            x: maxWidth / 2,
            y: maxHeight / 2
        });

        const charDataArr = [];

        objArray.forEach((obj) => {
            // Grid Lines
            /*const cell =  this.add.graphics();
            cell.lineStyle(1, 0x00ff00, 1);
            cell.strokeRect(obj.x, obj.y, maxWidth, maxHeight);
            container.add(cell);*/
            obj.x = obj.x + (maxWidth/2) - (obj.width/2);
        });

        objArray.forEach((obj) => {

            // Test Generate Data Array
            charDataArr.push({
                "@": {
                    "id": obj.text.charCodeAt(0),
                    "char": obj.text,
                    "x": obj.x,
                    "y": obj.y,
                    "width": obj.width,
                    "height": obj.height,
                    "xoffset": "0",
                    "yoffset": maxHeight - obj.height,
                    "xadvance": obj.width,
                    "page": "0",
                    "chnl": "15"
                }
            });
        });
        const xml = js2xmlparser.parse("font", {
            "info": {
                "@": {
                    "face": fontFamily,
                    "size": fontSize,
                    "bold": "0",
                    "italic": "0",
                    "charset": "",
                    "unicode": "1",
                    "stretchH": "100",
                    "smooth": "0",
                    "aa": "1",
                    "padding": "0,0,0,0",
                    "spacing": "0,0",
                    "outline": "0"
                }
            },
            "common": {
                "@": {
                    "lineHeight": maxHeight,
                    "base": maxHeight,
                    "scaleW": "512",
                    "scaleH": "512",
                    "pages": "1",
                    "packed": "0",
                    "alphaChnl": "0",
                    "redChnl": "4",
                    "greenChnl": "4",
                    "blueChnl": "4"
                }
            },
            "pages": {
                "pages": {
                    "@": {
                        "id": "0",
                        "file": "font.png",
                    }
                }
            },
            "chars": {
                "@": {
                    "count": charDataArr.length
                },
                "char": charDataArr
            }
        }, {
            format: {
                doubleQuotes: true
            }
        });
        console.log(xml);
    }

    /*testFont() {
        this.load.bitmapFont('test', require('../test.png'), require('../test.xml'));
        this.load.once('complete', () => {
            const text = this.add.bitmapText(100, 100, 'test', this.testString);
            text.x = 200 - text.width/2;
        });
        this.load.start();
    }*/

    create() {
        // Stage bg
        const bg =  this.add.graphics();
        bg.fillStyle(0xffffff, 1);
        bg.fillRect(0, 0, 512, 512);
        const btnGenerate = document.querySelector('#generate');
        btnGenerate.addEventListener('click', () => {
            this.generateFont();
        });
    }

    update() {
        // ok
    }
}
