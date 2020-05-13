import Phaser from 'phaser';
import WebFont from 'webfontloader';
const js2xmlparser = require("js2xmlparser");

export default class Main extends Phaser.Scene {
    constructor() {
        super({
            key: 'Main',
        });
    }

    preload() {

    }

    generateFont(maxWidth, maxHeight, objArray) {

        // Generate Font
        const fontFamily = document.querySelector('#fontFamily').value;
        const fontSize = parseInt(document.querySelector('#fontSize').value);

        const charDataArr = [];

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

        this.dlCanvas(this.game.canvas, document.querySelector('#fontMap'));
    }

    /**
     * From SO https://stackoverflow.com/questions/12796513/html5-canvas-to-png-file
     */
    dlCanvas(canvas, a) {
        let dt = canvas.toDataURL('image/png');
        /* Change MIME type to trick the browser to downlaod the file instead of displaying it */
        dt = dt.replace(/^data:image\/[^;]*/, 'data:application/octet-stream');

        /* In addition to <a>'s "download" attribute, you can define HTTP-style headers */
        dt = dt.replace(/^data:application\/octet-stream/, 'data:application/octet-stream;headers=Content-Disposition: attachment; filename=Canvas.png');

        // a.download = document.querySelector('#fontFamily').value + '.png';
        a.href = dt;
    };


    /*testFont() {
        this.load.bitmapFont('test', require('../test.png'), require('../test.xml'));
        this.load.once('complete', () => {
            const text = this.add.bitmapText(100, 100, 'test', this.testString);
            text.x = 200 - text.width/2;
        });
        this.load.start();
    }*/

    loadFont(font) {
        WebFont.load({
            google: {
                families: [font]
            },
            fontloading: () => {
                this.initResize();
            }
        });

    }


    initResize() {

        const fontFamily = document.querySelector('#fontFamily').value;
        const fontSize = parseInt(document.querySelector('#fontSize').value);
        const fontColor = document.querySelector('#fontColor').value;

        const charArray = [];
        const charString = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~';
        for (let i = 0; i < charString.length; i += 1) {
            charArray.push(charString[i]);
        }

        /**
         *
         * @type {Phaser.GameObjects.Text[]}
         */
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

        let maxWidth = Math.max(...widthArray);
        let maxHeight = Math.max(...heightArray);

        const gridWidth = 10;
        const gridHeight = 12;


        Phaser.Actions.GridAlign(objArray, {
            width: gridWidth,
            height: gridHeight,
            cellWidth: maxWidth,
            cellHeight: maxHeight,
            position: Phaser.Display.Align.TOP_LEFT,
            x: maxWidth / 2,
            y: maxHeight / 2
        });

        objArray.forEach((obj) => {
            // Grid Lines
            /*const cell =  this.add.graphics();
            cell.lineStyle(1, 0x00ff00, 1);
            cell.strokeRect(obj.x, obj.y, maxWidth, maxHeight);
            container.add(cell);*/
            obj.x = obj.x + (maxWidth/2) - (obj.width/2);
        });

        const width = maxWidth * gridWidth;
        const height = maxHeight * gridHeight;
        this.scene.scene.scale.once('resize', (gameSize,
                                               baseSize,
                                               displaySize,
                                               resolution,
                                               previousWidth,
                                               previousHeight) => {
            // this._bg.fillRect(0, 0, gameSize.width, gameSize.height);
            this.generateFont(maxWidth, maxHeight, objArray);
        });
        this.scale.resize(width, height);
    }

    create() {
        const btnGenerate = document.querySelector('#generate');
        btnGenerate.addEventListener('click', () => {
            const fontFamily = document.querySelector('#fontFamily').value;
            this.loadFont(fontFamily);
        });
    }

    update() {
        // ok
    }
}
