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
        this.selectedDeviceIdx = 1; // Default to the first device in the list : we use 1 not 0 to be user friendly

        runtime.on('targetWasCreated', this._onTargetCreated);
        runtime.on('RUNTIME_DISPOSED', this.clear.bind(this));

        // Listen for the stop event to close the WebSocket
        runtime.on(runtime.PROJECT_STOP_ALL, () => {
            this.closeWebSocket();
        });
    }

    async fetchAndConnect(index) {
        try {
            const response = await fetch(`${window.location.origin}/api/devices`);
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
            this.selectedDeviceIdx = index;
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
            this.socket = null;
        }
    }

    drawShape(args, util) {

        const SIZE = args.SIZE;
        const SHAPE = args.SHAPE;

        switch (SHAPE) {
            case 'square':
                this.drawSquare(args, util);
                break;
            case 'circle':
                this.drawCircle(args, util);
                break;
            case 'star':
                this.drawStar(args, util);
                break;
            case 'spiral':
                this.drawSpiral(args, util);
                break;
            case 'heart':
                this.drawHeart(args, util);
                break;
            case 'flower':
                this.drawFlower(args, util);
                break;
            case 'hexagon':
                this.drawHexagon(args, util);
                break;
            case 'wave':
                this.drawWave(args, util);
                break;
            default:
                console.log('Unknown shape');
                break;
        }
    }



    movesteps(args, util) {
        const steps = Cast.toNumber(args.STEPS);
        const radians = MathUtil.degToRad(90 - util.target.direction);
        const dx = steps * Math.cos(radians);
        const dy = steps * Math.sin(radians);
        util.target.setXY(util.target.x + dx, util.target.y + dy);
    }

    turnRight(args, util) {
        const degrees = Cast.toNumber(args.DEGREES);
        util.target.setDirection(util.target.direction + degrees);
    }

    turnLeft(args, util) {
        const degrees = Cast.toNumber(args.DEGREES);
        util.target.setDirection(util.target.direction - degrees);
    }

    /**
     * Draw a square
     * @param {number} size - the size of the square
     * @returns {void}
     * @private
     * @since 1.0.0
     *
     * We will need to move the sprite itself to draw the square to get the pen actually working
     */
    drawSquare(args, util) {

        const SIZE = args.SIZE;
        const angle = 90;

        for (let i = 0; i < 4; i++) {
            this.movesteps({ STEPS: SIZE }, util);
            this.turnRight({ DEGREES: angle }, util);
        }

    }

    drawCircle(args, util) {

        const steps = 18;
        const angle = 360 / steps;
        const size = args.SIZE;

        // Draw a circle of diameter size
        // try to estimate the length of the side of the circle
        const sideWidth = (size * Math.PI) / steps;

        for (let i = 0; i <= steps; i++) {
            const stepSize = (i === 0 || i === steps) ? sideWidth / 2 : sideWidth; // Make the first and last steps half the size to center the circle
            this.movesteps({ STEPS: stepSize }, util);
            if (i < steps) {
                this.turnRight({ DEGREES: angle }, util);
            }
        }
    }

    drawStar(args, util) {

        const SIZE = args.SIZE;
        const angle = 144;

        for (let i = 0; i < 5; i++) {
            this.movesteps({ STEPS: SIZE }, util);
            this.turnRight({ DEGREES: angle }, util);
        }

    }

    drawSpiral(args, util) {
        const fullTurns = args.SIZE; // Number of full turns
        const angle = 12; // Angle to turn at each step (in degrees)
        const totalSteps = 360 / angle * fullTurns; // Total number of steps to complete the spiral
        const stepIncrease = 0.1; // Increment in step size for the spiral

        let stepSize = 0; // Initialize step size

        for (let i = 0; i < totalSteps; i++) {
            this.movesteps({ STEPS: stepSize }, util); // Move forward by the current step size
            this.turnRight({ DEGREES: angle }, util); // Turn slightly
            stepSize += stepIncrease; // Gradually increase the step size to create the spiral effect
        }
    }


    drawHeart(args, util) {
        const size = args.SIZE / 10; // Scaling factor for the heart size
        const steps = 35; // Number of points for smoothness
        const angleIncrement = 2 * Math.PI / steps; // Increment for each step

        // Get the sprite's current position and direction
        const spriteX = util.target.x;
        const spriteY = util.target.y;
        const spriteDirection = 360 - util.target.direction % 360; // Convert to a 0-360 range

        // Compute the horizontal offset
        const RawoffsetX = 5 * size;

        // Precompute sine and cosine for the rotation
        const cosTheta = Math.cos(spriteDirection * (Math.PI / 180));
        const sinTheta = Math.sin(spriteDirection * (Math.PI / 180));

        // Initialize the parametric variable
        let t = 0;

        // Loop to calculate and transform the heart coordinates
        for (let i = 0; i <= steps; i++) {
            // Parametric heart equations
            const rawX = -size * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
            const rawY = size * 16 * Math.pow(Math.sin(t), 3);

            rawX = rawX + RawoffsetX;

            // Rotate the point based on the sprite's direction
            const rotatedX = rawX * cosTheta - rawY * sinTheta;
            const rotatedY = rawX * sinTheta + rawY * cosTheta;

            // Translate the point to match the sprite's current position
            const transformedX = spriteX + rotatedX;
            const transformedY = spriteY + rotatedY;

            // Set the sprite position to the calculated coordinates
            util.target.setXY(transformedX, transformedY);

            // Increment t for the next step
            t += angleIncrement;
        }
    }



    drawFlower(args, util) {
        const petalCount = args.SIZE; // Number of petals
        const petalLength = 50; // Length of each petal's arc
        const petalCurve = 6; // Number of steps for each petal curve
        const petalCurveAngle = 8; // Angle to turn for each petal curve
        const halfPetalAngle = petalCurveAngle * petalCurve; // Total angle covered by one petal (both sides)
        const turnAngle = 360 / petalCount; // Angle to turn between petals


        for (let i = 0; i < petalCount; i++) {
            // Draw one side of the petal
            for (let j = 0; j < petalCurve; j++) {
                this.movesteps({ STEPS: petalLength / petalCurve }, util); // Move forward slightly
                this.turnRight({ DEGREES: petalCurveAngle }, util); // Turn slightly to create the curve
            }

            // Turn to draw the other side of the petal
            this.turnRight({ DEGREES: 180 - halfPetalAngle }, util);

            // Draw the other side of the petal
            for (let j = 0; j < petalCurve; j++) {
                this.movesteps({ STEPS: petalLength / petalCurve }, util); // Move forward slightly
                this.turnRight({ DEGREES: petalCurveAngle }, util); // Turn slightly to cur ve back
            }

            // Turn to start the next petal
            this.turnRight({ DEGREES: 180 - halfPetalAngle + turnAngle }, util);
        }
    }



    drawHexagon(args, util) {

        const SIZE = args.SIZE;
        const angle = 60;

        for (let i = 0; i < 6; i++) {
            this.movesteps({ STEPS: SIZE }, util);
            this.turnRight({ DEGREES: angle }, util);
        }

    }

    drawWave(args, util) {
        const amplitude = args.SIZE; // Amplitude of the wave (height of each peak or trough)
        const waveSegments = 5; // Number of wave peaks and troughs


        for (let i = 0; i < waveSegments; i++) {
            // Draw upward curve (peak)
            this.turnLeft({ DEGREES: 45 }, util); // Turn down
            this.movesteps({ STEPS: amplitude }, util); // Move up by the amplitude
            this.turnRight({ DEGREES: 90 }, util); // Turn up
            this.movesteps({ STEPS: amplitude }, util); // Move forward by the amplitude
            this.turnLeft({ DEGREES: 45 }, util); // Turn down
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
     * The key to load & store a target's pen-related state.
     * @type {string}
     */
    static get STATE_KEY() {
        return 'Scratch.pen';
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
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo() {
        return {
            id: 'plottybot',
            name: formatMessage({
                id: 'plottybot.categoryName',
                default: 'PlottyBot',
                description: 'Label for the plottybot extension category'
            }),
            blockIconURI: blockIconURI,
            blocks: [
                {
                    opcode: 'connectToPlotty',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'plottybot.connectToPlotty',
                        default: 'Connect to Plotty [INDEX]',
                        description: 'Connect to PlottyBot device'
                    }),
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
                    text: formatMessage({
                        id: 'plottybot.getDeviceName',
                        default: 'Device name',
                        description: 'Get the name of the connected device'
                    })
                },
                {
                    opcode: 'getConnectionStatus',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'plottybot.getConnectionStatus',
                        default: 'Connection status',
                        description: 'Get the connection status of the device'
                    })
                },
                {
                    opcode: 'disconnectFromPlotty',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'plottybot.disconnectFromPlotty',
                        default: 'Disconnect from Plotty',
                        description: 'Disconnect from PlottyBot device'
                    })
                },
                {
                    opcode: 'clear',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'plottybot.clear',
                        default: 'erase all',
                        description: 'erase all pen trails'
                    })
                },
                {
                    opcode: 'penDown',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'plottybot.penDown',
                        default: 'pen down',
                        description: 'start leaving a trail when the sprite moves'
                    }),
                    filter: [TargetType.SPRITE]
                },
                {
                    opcode: 'penUp',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'plottybot.penUp',
                        default: 'pen up',
                        description: 'stop leaving a trail behind the sprite'
                    }),
                    filter: [TargetType.SPRITE]
                },
                {
                    opcode: 'drawShape',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'plottybot.drawShape',
                        default: 'Draw [SHAPE] with size [SIZE]',
                        description: 'Draw a shape with the specified size'
                    }),
                    arguments: {
                        SHAPE: {
                            type: ArgumentType.STRING,
                            menu: 'shapeMenu'
                        },
                        SIZE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 10
                        }
                    }
                }
            ],
            menus: {
                shapeMenu: [
                    { text: formatMessage({ id: 'plottybot.shapeMenu.square', default: 'Square' }), value: 'square' },
                    { text: formatMessage({ id: 'plottybot.shapeMenu.circle', default: 'Circle' }), value: 'circle' },
                    { text: formatMessage({ id: 'plottybot.shapeMenu.star', default: 'Star' }), value: 'star' },
                    { text: formatMessage({ id: 'plottybot.shapeMenu.spiral', default: 'Spiral' }), value: 'spiral' },
                    { text: formatMessage({ id: 'plottybot.shapeMenu.heart', default: 'Heart' }), value: 'heart' },
                    { text: formatMessage({ id: 'plottybot.shapeMenu.flower', default: 'Flower' }), value: 'flower' },
                    { text: formatMessage({ id: 'plottybot.shapeMenu.hexagon', default: 'Hexagon' }), value: 'hexagon' },
                    { text: formatMessage({ id: 'plottybot.shapeMenu.wave', default: 'Wave' }), value: 'wave' }
                ]
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

        switch (this.socket.readyState) {
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

        /* this.closeWebSocket();
        if (this.selectedDevice !== 'None') {
            this.fetchAndConnect(this.selectedDeviceIdx);
        }
        */
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

        // Add update to the websocket server
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            const data = {
                type: 'penUp',
                target: target.id,
            };
            this.socket.send(JSON.stringify(data));
        }
    }
}

module.exports = Scratch3PlottybotBlocks;
