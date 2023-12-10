/* 
   Filename: SophisticatedCode.js
   Content: This code demonstrates a complex search algorithm in JavaScript.
*/

// Generate a random array of numbers
function generateRandomArray(length) {
  const arr = [];
  for (let i = 0; i < length; i++) {
    arr.push(Math.floor(Math.random() * 100));
  }
  return arr;
}

// Bubble Sort algorithm
function bubbleSort(arr) {
  let len = arr.length;
  let swapped;
  do {
    swapped = false;
    for (let i = 0; i < len - 1; i++) {
      if (arr[i] > arr[i + 1]) {
        let temp = arr[i];
        arr[i] = arr[i + 1];
        arr[i + 1] = temp;
        swapped = true;
      }
    }
    len--;
  } while (swapped);
  return arr;
}

// Binary search algorithm
function binarySearch(arr, target) {
  let low = 0;
  let high = arr.length - 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return -1;
}

// Main function
function main() {
  const length = 100;
  const target = Math.floor(Math.random() * 100);
  const arr = generateRandomArray(length);
  console.log("Generated Array:", arr);

  console.log("Sorting the array...");
  const sortedArray = bubbleSort(arr);
  console.log("Sorted Array:", sortedArray);

  console.log("Binary Search for target:", target);
  const targetIndex = binarySearch(sortedArray, target);
  
  if (targetIndex !== -1) {
    console.log("Target", target, "found at index", targetIndex);
  } else {
    console.log("Target", target, "not found in the array");
  }
}

// Execute main function
main();