module.exports = {
  // function randomPick is to return specified number of elements in an array
  randomPick: (inputArray, picksNumber) => {
    // inputArray (Array): input collection to be picked randomly
    // picksNumber (int): how many items to be picked
    const dataArray = inputArray.slice() // declare a new array to avoid change the input array
    const pickedArray = []

    for (let i = 0; i < picksNumber; i++) {
      const index = Math.floor(Math.random() * dataArray.length)
      pickedArray.push(dataArray[index])
      dataArray.splice(index, 1)
    }
    return pickedArray
  }
}
