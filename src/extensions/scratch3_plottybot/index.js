const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const TargetType = require('../../extension-support/target-type');
const Cast = require('../../util/cast');
const Clone = require('../../util/clone');
const Color = require('../../util/color');
const formatMessage = require('format-message');
const MathUtil = require('../../util/math-util');
const RenderedTarget = require('../../sprites/rendered-target');
const log = require('../../util/log');
const StageLayering = require('../../engine/stage-layering');

/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const blockIconURI = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDBtbSIgaGVpZ2h0PSI0MG1tIiB2aWV3Qm94PSIwIDAgNDAgNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgICA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNDMuNDU3IC05OC44OTQpIj4KICAgICAgICA8cGF0aCBzdHlsZT0iZmlsbDojYWNkNGI5O2ZpbGwtb3BhY2l0eToxO3N0cm9rZTojMDAwO3N0cm9rZS13aWR0aDoxLjIyNzk0O3N0cm9rZS1saW5lY2FwOmJ1dHQ7c3Ryb2tlLWxpbmVqb2luOm1pdGVyO3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtzdHJva2Utb3BhY2l0eToxIiBkPSJtNDguMTY3IDEzMi44NzkgMjMuMzgxLjEyNXMwLTcuMTU3LjA1NC0xMS4xMTJjLjA1My0zLjk1NSAyLjcyMi04LjYgNi43MjYtOC41MzggNC4wMDMuMDYzLTE3LjgzLS4wNjItMjIuMjYtLjEyNS00LjQzMS0uMDYzLTcuNTggNC44OTctNy43OTQgOS4xMDMtLjIxNCA0LjIwNi0uMTA3IDEwLjU0Ny0uMTA3IDEwLjU0N3oiLz4KICAgICAgICA8cmVjdCBzdHlsZT0iZmlsbDojZmZmO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTojMDAwO3N0cm9rZS13aWR0aDouOTQyNzY2O3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjptaXRlcjtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MTtwYWludC1vcmRlcjpub3JtYWw7c3RvcC1jb2xvcjojMDAwIiB3aWR0aD0iMjkuNzc5IiBoZWlnaHQ9IjMuMDA0IiB4PSI0Ny4xMDMiIHk9IjEwNS41MTIiIHJ5PSIuODIzIi8+CiAgICAgICAgPHJlY3Qgc3R5bGU9ImZpbGw6I2ZmZjtmaWxsLW9wYWNpdHk6MTtzdHJva2U6IzAwMDtzdHJva2Utd2lkdGg6LjkwMzYyNjtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46bWl0ZXI7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1vcGFjaXR5OjE7cGFpbnQtb3JkZXI6bm9ybWFsO3N0b3AtY29sb3I6IzAwMCIgd2lkdGg9IjEwLjU5OCIgaGVpZ2h0PSI3Ljc1NSIgeD0iNTUuNDEzIiB5PSIxMDMuNjA3IiByeT0iMCIvPgogICAgICAgIDxwYXRoIHN0eWxlPSJmaWxsOm5vbmU7c3Ryb2tlOiMwMDA7c3Ryb2tlLXdpZHRoOi44NDEzOTE7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtzdHJva2Utb3BhY2l0eToxIiBkPSJNNjUuMDE4IDEyMy4xNGMxLjIxNCAyLjU4LS40NTQgNC42NDMtMi40MSAzLjg5My4yODYgMy42MzEtNC4zNDkgMy4wODQtMy45ODMuMTk2LTIuNTMyIDEuNTc2LTQuNTI4LTMuNTY3LTEuNTQ4LTQuMzMxLTEuODg1LTQuMDU3IDIuMzQtNS4yODIgMy4wNDMtMy4xNCIvPgogICAgICAgIDxwYXRoIHN0eWxlPSJmaWxsOiMwMDA7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmU7c3Ryb2tlLXdpZHRoOjIuMDY7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOm1pdGVyO3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtzdHJva2Utb3BhY2l0eToxO3BhaW50LW9yZGVyOm5vcm1hbDtzdG9wLWNvbG9yOiMwMDAiIGQ9Im0tODAuMjA4LTI1LjM3My0xNS45OTQtMjguNTIyIDMyLjY4OS4zODV6IiB0cmFuc2Zvcm09Im1hdHJpeCguMDg3MDEgLS4wMDE5IC4wMDE2MSAuMTAyMzMgNjcuMzUgMTIyLjM4MikiLz4KICAgICAgICA8cmVjdCBzdHlsZT0iZmlsbDojZmNmZGZmO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTojMDAwO3N0cm9rZS13aWR0aDouNDc4NDA1O3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjptaXRlcjtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MTtwYWludC1vcmRlcjpub3JtYWw7c3RvcC1jb2xvcjojMDAwIiB3aWR0aD0iNC4xMDUiIGhlaWdodD0iMTEuOTkxIiB4PSI1OC4yMzIiIHk9IjEwNS42NiIgcnk9Ii41MDQiLz4KICAgIDwvZz4KPC9zdmc+Cg==';

/**
 * Enum for pen color parameter values.
 * @readonly
 * @enum {string}
 */
const ColorParam = {
    COLOR: 'color',
    SATURATION: 'saturation',
    BRIGHTNESS: 'brightness',
    TRANSPARENCY: 'transparency'
};

/**
 * @typedef {object} PenState - the pen state associated with a particular target.
 * @property {Boolean} penDown - tracks whether the pen should draw for this target.
 * @property {number} color - the current color (hue) of the pen.
 * @property {PenAttributes} penAttributes - cached pen attributes for the renderer. This is the authoritative value for
 *   diameter but not for pen color.
 */

/**
 * Host for the Pen-related blocks in Scratch 3.0
 * @param {Runtime} runtime - the runtime instantiating this block package.
 * @constructor
 */
class Scratch3PlottybotBlocks {
    constructor(runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;

        /**
         * The ID of the renderer Drawable corresponding to the pen layer.
         * @type {int}
         * @private
         */
        this._penDrawableId = -1;

        /**
         * The ID of the renderer Skin corresponding to the pen layer.
         * @type {int}
         * @private
         */
        this._penSkinId = -1;

        this._onTargetCreated = this._onTargetCreated.bind(this);
        this._onTargetMoved = this._onTargetMoved.bind(this);

        this.selectedDevice = 'None';

        runtime.on('targetWasCreated', this._onTargetCreated);
        runtime.on('RUNTIME_DISPOSED', this.clear.bind(this));

        // Listen for the stop event to close the WebSocket
        runtime.on(runtime.PROJECT_STOP_ALL, () => {
            this.closeWebSocket();
        });
    }

    async fetchAndConnect(index) {
        try {
            const response = await fetch('http://192.168.178.192:3000/api/devices');
            if (!response.ok) {
                console.error('API not reachable');
                this.selectedDevice = 'None';
                return;
            }

            const deviceList = await response.json();
            if (typeof deviceList !== 'object') {
                console.error('Unexpected response format');
                this.selectedDevice = 'None';
                return;
            }

            const entries = Object.entries(deviceList);
            if (!entries[index - 1]) {
                console.error('Index out of range');
                this.selectedDevice = 'None';
                return;
            }

            const [name, ip] = entries[index - 1];
            console.log(`Connecting to ${name} at ${ip}`);
            this.selectedDevice = name;
            this.connectWebSocket(ip);
        } catch (error) {
            console.error('Failed to fetch or connect:', error);
            this.selectedDevice = 'None';
        }
    }


    /**
     * 
     * Connect the WebSocket to the server
     * 
     * @memberof Scratch3PlottybotBlocks
     * 
     * @returns {void}
     * 
     * @private
     * 
     * @since 1.0.0
     * 
     * @todo Add error handling
     * 
     * @todo Add a way to change the server address
     * 
     */
    connectWebSocket(ip) {
        this.socket = new WebSocket(`ws://${ip}:8766`);

        this.socket.addEventListener('open', (event) => {
            console.log('WebSocket connected:', event);
        });

        this.socket.addEventListener('message', (event) => {
            console.log('WebSocket message received:', event);
        });

        this.socket.addEventListener('close', (event) => {
            console.log('WebSocket connection closed:', event);
        });

        this.socket.addEventListener('error', (event) => {
            console.log('WebSocket error:', event);

            // Try to reconnect in 5 seconds
            setTimeout(() => {
                this.connectWebSocket(ip);
            }, 5000);
        });
    }

    closeWebSocket() {
        if (this.socket) {
            this.socket.close();
        }
    }



    /**
     * The default pen state, to be used when a target has no existing pen state.
     * @type {PenState}
     */
    static get DEFAULT_PEN_STATE() {
        return {
            penDown: false,
            color: 66.66,
            saturation: 100,
            brightness: 100,
            transparency: 0,
            _shade: 50, // Used only for legacy `change shade by` blocks
            penAttributes: {
                color4f: [0, 0, 1, 1],
                diameter: 1
            }
        };
    }


    /**
     * The minimum and maximum allowed pen size.
     * The maximum is twice the diagonal of the stage, so that even an
     * off-stage sprite can fill it.
     * @type {{min: number, max: number}}
     */
    static get PEN_SIZE_RANGE() {
        return { min: 1, max: 1200 };
    }

    /**
     * The key to load & store a target's pen-related state.
     * @type {string}
     */
    static get STATE_KEY() {
        return 'Scratch.pen';
    }

    /**
     * Clamp a pen size value to the range allowed by the pen.
     * @param {number} requestedSize - the requested pen size.
     * @returns {number} the clamped size.
     * @private
     */
    _clampPenSize(requestedSize) {
        return MathUtil.clamp(
            requestedSize,
            Scratch3PlottybotBlocks.PEN_SIZE_RANGE.min,
            Scratch3PlottybotBlocks.PEN_SIZE_RANGE.max
        );
    }

    /**
     * Retrieve the ID of the renderer "Skin" corresponding to the pen layer. If
     * the pen Skin doesn't yet exist, create it.
     * @returns {int} the Skin ID of the pen layer, or -1 on failure.
     * @private
     */
    _getPenLayerID() {
        if (this._penSkinId < 0 && this.runtime.renderer) {
            this._penSkinId = this.runtime.renderer.createPenSkin();
            this._penDrawableId = this.runtime.renderer.createDrawable(StageLayering.PEN_LAYER);
            this.runtime.renderer.updateDrawableSkinId(this._penDrawableId, this._penSkinId);
        }
        return this._penSkinId;
    }

    /**
     * @param {Target} target - collect pen state for this target. Probably, but not necessarily, a RenderedTarget.
     * @returns {PenState} the mutable pen state associated with that target. This will be created if necessary.
     * @private
     */
    _getPenState(target) {
        let penState = target.getCustomState(Scratch3PlottybotBlocks.STATE_KEY);
        if (!penState) {
            penState = Clone.simple(Scratch3PlottybotBlocks.DEFAULT_PEN_STATE);
            target.setCustomState(Scratch3PlottybotBlocks.STATE_KEY, penState);
        }
        return penState;
    }

    /**
     * When a pen-using Target is cloned, clone the pen state.
     * @param {Target} newTarget - the newly created target.
     * @param {Target} [sourceTarget] - the target used as a source for the new clone, if any.
     * @listens Runtime#event:targetWasCreated
     * @private
     */
    _onTargetCreated(newTarget, sourceTarget) {
        if (sourceTarget) {
            const penState = sourceTarget.getCustomState(Scratch3PlottybotBlocks.STATE_KEY);
            if (penState) {
                newTarget.setCustomState(Scratch3PlottybotBlocks.STATE_KEY, Clone.simple(penState));
                if (penState.penDown) {
                    newTarget.addListener(RenderedTarget.EVENT_TARGET_MOVED, this._onTargetMoved);
                }
            }
        }
    }

    /**
     * Handle a target which has moved. This only fires when the pen is down.
     * @param {RenderedTarget} target - the target which has moved.
     * @param {number} oldX - the previous X position.
     * @param {number} oldY - the previous Y position.
     * @param {boolean} isForce - whether the movement was forced.
     * @private
     */
    _onTargetMoved(target, oldX, oldY, isForce) {
        // Only move the pen if the movement isn't forced (ie. dragged).
        if (!isForce) {
            const penSkinId = this._getPenLayerID();
            if (penSkinId >= 0) {
                const penState = this._getPenState(target);
                this.runtime.renderer.penLine(penSkinId, penState.penAttributes, oldX, oldY, target.x, target.y);
                this.runtime.requestRedraw();

                if (this.socket && this.socket.readyState === WebSocket.OPEN) {
                    const data = {
                        type: 'goToXY',
                        target: target.id,
                        x: target.x,
                        y: target.y,
                        oldX: oldX,
                        oldY: oldY
                    };
                    this.socket.send(JSON.stringify(data));
                }
            }
        }
    }

    /**
     * Wrap a color input into the range (0,100).
     * @param {number} value - the value to be wrapped.
     * @returns {number} the wrapped value.
     * @private
     */
    _wrapColor(value) {
        return MathUtil.wrapClamp(value, 0, 100);
    }

    /**
     * Initialize color parameters menu with localized strings
     * @returns {array} of the localized text and values for each menu element
     * @private
     */
    _initColorParam() {
        return [
            {
                text: formatMessage({
                    id: 'pen.colorMenu.color',
                    default: 'color',
                    description: 'label for color element in color picker for pen extension'
                }),
                value: ColorParam.COLOR
            },
            {
                text: formatMessage({
                    id: 'pen.colorMenu.saturation',
                    default: 'saturation',
                    description: 'label for saturation element in color picker for pen extension'
                }),
                value: ColorParam.SATURATION
            },
            {
                text: formatMessage({
                    id: 'pen.colorMenu.brightness',
                    default: 'brightness',
                    description: 'label for brightness element in color picker for pen extension'
                }),
                value: ColorParam.BRIGHTNESS
            },
            {
                text: formatMessage({
                    id: 'pen.colorMenu.transparency',
                    default: 'transparency',
                    description: 'label for transparency element in color picker for pen extension'
                }),
                value: ColorParam.TRANSPARENCY

            }
        ];
    }

    /**
     * Clamp a pen color parameter to the range (0,100).
     * @param {number} value - the value to be clamped.
     * @returns {number} the clamped value.
     * @private
     */
    _clampColorParam(value) {
        return MathUtil.clamp(value, 0, 100);
    }

    /**
     * Convert an alpha value to a pen transparency value.
     * Alpha ranges from 0 to 1, where 0 is transparent and 1 is opaque.
     * Transparency ranges from 0 to 100, where 0 is opaque and 100 is transparent.
     * @param {number} alpha - the input alpha value.
     * @returns {number} the transparency value.
     * @private
     */
    _alphaToTransparency(alpha) {
        return (1.0 - alpha) * 100.0;
    }

    /**
     * Convert a pen transparency value to an alpha value.
     * Alpha ranges from 0 to 1, where 0 is transparent and 1 is opaque.
     * Transparency ranges from 0 to 100, where 0 is opaque and 100 is transparent.
     * @param {number} transparency - the input transparency value.
     * @returns {number} the alpha value.
     * @private
     */
    _transparencyToAlpha(transparency) {
        return 1.0 - (transparency / 100.0);
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo() {
        return {
            id: 'plottybot',
            name: formatMessage({
                id: 'plottybot.categoryName',
                default: 'Plottybot',
                description: 'Label for the plottybot extension category'
            }),
            blockIconURI: blockIconURI,
            blocks: [
                {
                    opcode: 'connectToPlotty',
                    blockType: BlockType.COMMAND,
                    text: 'Connect to Plotty [INDEX]',
                    arguments: {
                        INDEX: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        }
                    }
                },
                {
                    opcode: 'getDeviceName',
                    blockType: BlockType.REPORTER,
                    text: 'Device name'
                },
                {
                    opcode: 'getConnectionStatus',
                    blockType: BlockType.REPORTER,
                    text: 'Connection status'
                },
                {
                    opcode: 'disconnectFromPlotty',
                    blockType: BlockType.COMMAND,
                    text: 'Disconnect from Plotty'
                },
                {
                    opcode: 'clear',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'pen.clear',
                        default: 'erase all',
                        description: 'erase all pen trails'
                    })
                },
                {
                    opcode: 'penDown',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'pen.penDown',
                        default: 'pen down',
                        description: 'start leaving a trail when the sprite moves'
                    }),
                    filter: [TargetType.SPRITE]
                },
                {
                    opcode: 'penUp',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'pen.penUp',
                        default: 'pen up',
                        description: 'stop leaving a trail behind the sprite'
                    }),
                    filter: [TargetType.SPRITE]
                },
                /* Legacy blocks, should not be shown in flyout */
                {
                    opcode: 'setPenShadeToNumber',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'pen.setShade',
                        default: 'set pen shade to [SHADE]',
                        description: 'legacy pen blocks - set pen shade'
                    }),
                    arguments: {
                        SHADE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        }
                    },
                    hideFromPalette: true
                },
                {
                    opcode: 'changePenShadeBy',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'pen.changeShade',
                        default: 'change pen shade by [SHADE]',
                        description: 'legacy pen blocks - change pen shade'
                    }),
                    arguments: {
                        SHADE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        }
                    },
                    hideFromPalette: true
                },
                {
                    opcode: 'setPenHueToNumber',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'pen.setHue',
                        default: 'set pen color to [HUE]',
                        description: 'legacy pen blocks - set pen color to number'
                    }),
                    arguments: {
                        HUE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        }
                    },
                    hideFromPalette: true
                },
                {
                    opcode: 'changePenHueBy',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'pen.changeHue',
                        default: 'change pen color by [HUE]',
                        description: 'legacy pen blocks - change pen color'
                    }),
                    arguments: {
                        HUE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        }
                    },
                    hideFromPalette: true
                }
            ],
            menus: {
                colorParam: {
                    acceptReporters: true,
                    items: this._initColorParam()
                }
            }
        };
    }

    // Command block to connect to Plotty
    connectToPlotty(args) {
        const index = args.INDEX;
        this.fetchAndConnect(index); // Assumes fetchAndConnect is an async function wrapped to handle in Scratch
    }

    // Reporter block for Device name
    getDeviceName() {
        return this.selectedDevice; // Assumes this.selectedDevice is set somewhere in your code
    }

    // Reporter block for Connection status
    getConnectionStatus() {
        if (!this.socket) {
            return 'Not Connected';
        }
    
        switch(this.socket.readyState) {
            case WebSocket.CONNECTING:
                return 'Connecting';
            case WebSocket.OPEN:
                return 'Connected';
            case WebSocket.CLOSING:
                return 'Closing';
            case WebSocket.CLOSED:
                return 'Closed';
            default:
                return 'Unknown';
        }
    }
    

    // Command block to disconnect from Plotty
    disconnectFromPlotty() {
        this.closeWebSocket(); // Assumes closeWebSocket is defined to close the socket
    }

    /**
     * The pen "clear" block clears the pen layer's contents.
     */
    clear() {
        const penSkinId = this._getPenLayerID();
        if (penSkinId >= 0) {
            this.runtime.renderer.penClear(penSkinId);
            this.runtime.requestRedraw();
        }
        this.closeWebSocket();
        this.connectWebSocket();
    }



    /**
     * The pen "pen down" block causes the target to leave pen trails on future motion.
     * @param {object} args - the block arguments.
     * @param {object} util - utility object provided by the runtime.
     */
    penDown(args, util) {
        const target = util.target;
        const penState = this._getPenState(target);

        if (!penState.penDown) {
            penState.penDown = true;
            target.addListener(RenderedTarget.EVENT_TARGET_MOVED, this._onTargetMoved);
        }

        const penSkinId = this._getPenLayerID();
        if (penSkinId >= 0) {
            this.runtime.renderer.penPoint(penSkinId, penState.penAttributes, target.x, target.y);
            this.runtime.requestRedraw();
        }

        // Add update to the websocket server
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            const data = {
                type: 'penDown',
                target: target.id,
            };
            this.socket.send(JSON.stringify(data));
        }
    }

    /**
     * The pen "pen up" block stops the target from leaving pen trails.
     * @param {object} args - the block arguments.
     * @param {object} util - utility object provided by the runtime.
     */
    penUp(args, util) {
        const target = util.target;
        const penState = this._getPenState(target);

        if (penState.penDown) {
            penState.penDown = false;
            target.removeListener(RenderedTarget.EVENT_TARGET_MOVED, this._onTargetMoved);
        }
    }



    /**
     * Update the cached color from the color, saturation, brightness and transparency values
     * in the provided PenState object.
     * @param {PenState} penState - the pen state to update.
     * @private
     */
    _updatePenColor(penState) {
        const rgb = Color.hsvToRgb({
            h: penState.color * 360 / 100,
            s: penState.saturation / 100,
            v: penState.brightness / 100
        });
        penState.penAttributes.color4f[0] = rgb.r / 255.0;
        penState.penAttributes.color4f[1] = rgb.g / 255.0;
        penState.penAttributes.color4f[2] = rgb.b / 255.0;
        penState.penAttributes.color4f[3] = this._transparencyToAlpha(penState.transparency);
    }

    /**
     * Set or change a single color parameter on the pen state, and update the pen color.
     * @param {ColorParam} param - the name of the color parameter to set or change.
     * @param {number} value - the value to set or change the param by.
     * @param {PenState} penState - the pen state to update.
     * @param {boolean} change - if true change param by value, if false set param to value.
     * @private
     */
    _setOrChangeColorParam(param, value, penState, change) {
        switch (param) {
            case ColorParam.COLOR:
                penState.color = this._wrapColor(value + (change ? penState.color : 0));
                break;
            case ColorParam.SATURATION:
                penState.saturation = this._clampColorParam(value + (change ? penState.saturation : 0));
                break;
            case ColorParam.BRIGHTNESS:
                penState.brightness = this._clampColorParam(value + (change ? penState.brightness : 0));
                break;
            case ColorParam.TRANSPARENCY:
                penState.transparency = this._clampColorParam(value + (change ? penState.transparency : 0));
                break;
            default:
                log.warn(`Tried to set or change unknown color parameter: ${param}`);
        }
        this._updatePenColor(penState);
    }

    /* LEGACY OPCODES */
    /**
     * Scratch 2 "hue" param is equivelant to twice the new "color" param.
     * @param {object} args - the block arguments.
     *  @property {number} HUE - the amount to set the hue to.
     * @param {object} util - utility object provided by the runtime.
     */
    setPenHueToNumber(args, util) {
        const penState = this._getPenState(util.target);
        const hueValue = Cast.toNumber(args.HUE);
        const colorValue = hueValue / 2;
        this._setOrChangeColorParam(ColorParam.COLOR, colorValue, penState, false);
        this._setOrChangeColorParam(ColorParam.TRANSPARENCY, 0, penState, false);
        this._legacyUpdatePenColor(penState);
    }

    /**
     * Scratch 2 "hue" param is equivelant to twice the new "color" param.
     * @param {object} args - the block arguments.
     *  @property {number} HUE - the amount of desired hue change.
     * @param {object} util - utility object provided by the runtime.
     */
    changePenHueBy(args, util) {
        const penState = this._getPenState(util.target);
        const hueChange = Cast.toNumber(args.HUE);
        const colorChange = hueChange / 2;
        this._setOrChangeColorParam(ColorParam.COLOR, colorChange, penState, true);

        this._legacyUpdatePenColor(penState);
    }

    /**
     * Use legacy "set shade" code to calculate RGB value for shade,
     * then convert back to HSV and store those components.
     * It is important to also track the given shade in penState._shade
     * because it cannot be accurately backed out of the new HSV later.
     * @param {object} args - the block arguments.
     *  @property {number} SHADE - the amount to set the shade to.
     * @param {object} util - utility object provided by the runtime.
     */
    setPenShadeToNumber(args, util) {
        const penState = this._getPenState(util.target);
        let newShade = Cast.toNumber(args.SHADE);

        // Wrap clamp the new shade value the way scratch 2 did.
        newShade = newShade % 200;
        if (newShade < 0) newShade += 200;

        // And store the shade that was used to compute this new color for later use.
        penState._shade = newShade;

        this._legacyUpdatePenColor(penState);
    }

    /**
     * Because "shade" cannot be backed out of hsv consistently, use the previously
     * stored penState._shade to make the shade change.
     * @param {object} args - the block arguments.
     *  @property {number} SHADE - the amount of desired shade change.
     * @param {object} util - utility object provided by the runtime.
     */
    changePenShadeBy(args, util) {
        const penState = this._getPenState(util.target);
        const shadeChange = Cast.toNumber(args.SHADE);
        this.setPenShadeToNumber({ SHADE: penState._shade + shadeChange }, util);
    }

    /**
     * Update the pen state's color from its hue & shade values, Scratch 2.0 style.
     * @param {object} penState - update the HSV & RGB values in this pen state from its hue & shade values.
     * @private
     */
    _legacyUpdatePenColor(penState) {
        // Create the new color in RGB using the scratch 2 "shade" model
        let rgb = Color.hsvToRgb({ h: penState.color * 360 / 100, s: 1, v: 1 });
        const shade = (penState._shade > 100) ? 200 - penState._shade : penState._shade;
        if (shade < 50) {
            rgb = Color.mixRgb(Color.RGB_BLACK, rgb, (10 + shade) / 60);
        } else {
            rgb = Color.mixRgb(rgb, Color.RGB_WHITE, (shade - 50) / 60);
        }

        // Update the pen state according to new color
        const hsv = Color.rgbToHsv(rgb);
        penState.color = 100 * hsv.h / 360;
        penState.saturation = 100 * hsv.s;
        penState.brightness = 100 * hsv.v;

        this._updatePenColor(penState);
    }
}

module.exports = Scratch3PlottybotBlocks;
