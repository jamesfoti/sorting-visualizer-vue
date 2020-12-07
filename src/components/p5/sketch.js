// Sketch that you would normally edit in p5.js.
// For more info: https://p5js.org/reference/#/p5/p5
import AudioManager from './audio-manager';

export function sketch(p) {
    let arr = [];
    let colors = [];
    let isSorting = false;
    let currNumElements = 10; // Needs to be the same as the slider default value.
    let textColor = p.color('#000000'); // Not a constant b/c we need to change it to white when in dark mode.
    let sortingDelay = 100 // Not a consant b/c we need to change it when speed slider is changed.
    let audioManager;
    const STROKE_WEIGHT = 3;
    const DEFAULT_ELEMENT_COLOR = p.color('#7CACFF');
    const SCANNING_COLOR = p.color('orange');
    const SECOND_SCANNING_COLOR = p.color('red');
    const SWAP_COLOR = p.color('purple');
    const FOUND_COLOR = p.color('#0B0268');
    const SORTED_COLOR = p.color('green');
    const SPACING = 0;
    const MIN_HEIGHT = 5;
    const MAX_HEIGHT = 100;
    const HEIGHT_SCALE = 6.5;
    const Y_POS_OFFSET = 140;
    const CENTER_OFFSET = 100;
    const TEXT_HEIGHT_OFFSET = 5;

    p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.clear();
        p.createArray();
        audioManager = new AudioManager();
    };

    p.draw = function () {
        p.clear();
        if (!isSorting) {
            p.resetElementColors();
        }
        p.showArray();
    };

    p.windowResized = function () {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.clear();
        p.createArray();
    };

    p.toggleSound = function () {
        console.log("TOGGLE");
        audioManager.isMute = !audioManager.isMute;
    };

    p.toggleTheme = function (isDark) {
        console.log("sketch.js Toggle Theme!");
        if (isDark) textColor = p.color('#FFFFFF');
        else textColor = p.color('#000000');
    }

    p.updateDelay = function (delay) {
        sortingDelay = delay;
    }

    p.createArray = function (size = currNumElements) {
        console.log("Creating Array!");
        isSorting = false;
        arr.splice(0, arr.length);
        colors.splice(0, colors.length);
        arr = [];
        colors = [];

        currNumElements = size; // Update default size from slider input for resizing window.

        for (let i = 0; i < size; i++) {
            let randomValue = p.floor(p.random(MIN_HEIGHT, MAX_HEIGHT));
            arr.push(randomValue);
            colors.push(DEFAULT_ELEMENT_COLOR);
        }
    };

    p.resetElementColors = function () {
        for (let i = 0; i < colors.length; i++) {
            colors[i] = DEFAULT_ELEMENT_COLOR;
        }
    }

    p.showArray = function () {
        // For more info about the array arrangment: 
        // https://editor.p5js.org/cassie/sketches/ZE4F7xCZS
        // https://editor.p5js.org/kmason/sketches/BJITNrzfE

        // I also played around a lot with these variables to achieve desired arrangement.
        let w = (p.windowWidth - CENTER_OFFSET - (currNumElements * SPACING)) / currNumElements;
        for (let i = 0; i < arr.length; i++) {
            let x = i * (w + SPACING) + CENTER_OFFSET / 2;
            let y = p.windowHeight - Y_POS_OFFSET;
            let h = arr[i];

            p.strokeWeight(STROKE_WEIGHT);
            p.fill(colors[i]);
            p.rect(x, y, w, -h * HEIGHT_SCALE);

            let text = h;
            let textX = x + w / 2
            let textY = y - h * HEIGHT_SCALE - TEXT_HEIGHT_OFFSET;

            p.textAlign(p.CENTER);
            p.textSize(w / 4);
            p.fill(textColor);
            p.text(text, textX, textY)
        }
    };

    p.bubbleSort = async function () {
        console.log("Bubble Sort!");
        isSorting = true;

        for (let i = 0; i < arr.length - 1; i++) {
            if (!isSorting) return;
            for (let j = 0; j < arr.length - i - 1; j++) {
                if (!isSorting) return;
                // I had to do try/catch b/c this the only way 
                // from stopping tone.js from throwing error that
                // says 'start time must be greater than previous
                // time'.

                colors[j] = SCANNING_COLOR;
                colors[j + 1] = SCANNING_COLOR;
                // eslint-disable-next-line no-empty
                try { audioManager.playScanningSound(j); } catch { }

                await p.sleep(sortingDelay);
                if (arr[j] > arr[j + 1]) {
                    let temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
                colors[j] = DEFAULT_ELEMENT_COLOR;
                colors[j + 1] = DEFAULT_ELEMENT_COLOR;
            }
            // We are using currNumElements b/c colors.length is not working properly when createArray()
            // is called during sorting and I can't figure out why. So updating currNumElements with the inputed
            // size in createArray() seems to work. See createArray() function.
            colors[currNumElements - 1 - i] = SORTED_COLOR;
            audioManager.playSortedSound(i);
        }
        colors[0] = SORTED_COLOR;
    };

    p.selectionSort = async function () {
        isSorting = true;
        let min;

        for (let i = 0; i < arr.length - 1; i++) {
            if (!isSorting) return;
            colors[i] = SCANNING_COLOR;
            min = i;
            audioManager.playScanningSound(i);
            for (let j = i + 1; j < arr.length; j++) {
                if (!isSorting) return;
                colors[j] = SECOND_SCANNING_COLOR;
                audioManager.play2ndScanningSound(j);
                await p.sleep(sortingDelay);
                colors[j] = DEFAULT_ELEMENT_COLOR;
                if (arr[j] < arr[min]) {
                    min = j;
                }
            }
            if (min != i) {
                colors[min] = FOUND_COLOR;
                await p.sleep(sortingDelay);

                let temp = arr[i];
                arr[i] = arr[min];
                arr[min] = temp;
                colors[i] = DEFAULT_ELEMENT_COLOR;
                colors[min] = DEFAULT_ELEMENT_COLOR;
            }
            colors[i] = SORTED_COLOR;
            audioManager.playSortedSound(i);

        }
        colors[colors.length - 1] = SORTED_COLOR;
        audioManager.playSortedSound(colors.length - 1);

    }

    p.insertionSort = async function () {
        console.log("INSERTION SORT!");
        isSorting = true;
        let n = arr.length;
        for (let i = 1; i < n; i++) {
            if (!isSorting) return;
            let key = arr[i];
            let j = i - 1;
            colors[i] = SCANNING_COLOR
            colors[j] = SCANNING_COLOR
            audioManager.playScanningSound(i);
            audioManager.play2ndScanningSound(j);
            await p.sleep(sortingDelay);
            colors[i] = DEFAULT_ELEMENT_COLOR
            colors[j] = DEFAULT_ELEMENT_COLOR
            await p.sleep(sortingDelay);

            // Move elements of arr[0..i-1], 
            // that are greater than key, 
            // to one position ahead of 
            // their current position 
            while (j >= 0 && arr[j] > key) {
                if (!isSorting) return;
                arr[j + 1] = arr[j];
                j = j - 1;
                colors[j + 1] = SCANNING_COLOR
                colors[j] = SCANNING_COLOR
                audioManager.playScanningSound(j + 1);
                audioManager.play2ndScanningSound(j);

                await p.sleep(sortingDelay);
                colors[j + 1] = DEFAULT_ELEMENT_COLOR
                colors[j] = DEFAULT_ELEMENT_COLOR
            }
            arr[j + 1] = key;
        }
        for (let i = 0; i < arr.length; i++) {
            colors[i] = SORTED_COLOR;
            audioManager.playSortedSound(i);
            await p.sleep(sortingDelay);
        }
    };

    p.quickSort = async function () {
        console.log("BEFORE: " + arr);
        isSorting = true;
        // Source: https://stackabuse.com/quicksort-in-javascript/
        // Creating an array that we'll use as a stack, using the push() and pop() functions
        let stack = [];

        // Adding the entire initial array as an "unsorted subarray"
        stack.push(0);
        stack.push(arr.length - 1);

        // There isn't an explicit peek() function
        // The loop repeats as long as we have unsorted subarrays
        while (stack[stack.length - 1] >= 0) {
            if (!isSorting) return;

            // Extracting the top unsorted subarray
            let end = stack.pop();
            let start = stack.pop();
            let pivotIndex = await p.partition(start, end);

            // If there are unsorted elements to the "left" of the pivot,
            // we add that subarray to the stack so we can sort it later
            if (pivotIndex - 1 > start) {
                stack.push(start);
                stack.push(pivotIndex - 1);
            }
            else {
                colors[pivotIndex - 1] = SORTED_COLOR;
            }

            // If there are unsorted elements to the "right" of the pivot,
            // we add that subarray to the stack so we can sort it later
            if (pivotIndex + 1 < end) {
                stack.push(pivotIndex + 1);
                stack.push(end);
            } else {
                colors[pivotIndex + 1] = SORTED_COLOR;
            }


        }
        console.log("AFTER: " + arr);

    };

    p.partition = async function (start, end) {
        if (!isSorting) return;
        const pivotValue = arr[end];
        let pivotIndex = start;
        colors[end] = SECOND_SCANNING_COLOR;
        await p.sleep(sortingDelay);

        for (let i = start; i < end; i++) {
            if (!isSorting) return;
            colors[i] = SCANNING_COLOR;
            // eslint-disable-next-line no-empty
            try { audioManager.playScanningSound(i); } catch { }
            await p.sleep(sortingDelay);
            colors[i] = DEFAULT_ELEMENT_COLOR;

            if (arr[i] < pivotValue) {
                colors[i] = SWAP_COLOR;
                colors[pivotIndex] = SWAP_COLOR;
                await p.sleep(sortingDelay);

                // Swapping elements
                [arr[i], arr[pivotIndex]] = [arr[pivotIndex], arr[i]];

                colors[i] = DEFAULT_ELEMENT_COLOR;
                colors[pivotIndex] = DEFAULT_ELEMENT_COLOR;

                // Moving to next element
                pivotIndex++;
            }
        }
        colors[pivotIndex] = SWAP_COLOR;
        colors[end] = SWAP_COLOR;
        await p.sleep(sortingDelay);

        // Putting the pivot value in the middle
        [arr[pivotIndex], arr[end]] = [arr[end], arr[pivotIndex]];

        colors[pivotIndex] = SORTED_COLOR;
        colors[end] = SORTED_COLOR;
        audioManager.playSortedSound(pivotIndex);

        return pivotIndex;
    };

    p.sleep = function (ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    };
}