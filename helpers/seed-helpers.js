function RandomChooser (arr) {
  this.copyArr = arr.slice(0)
  this.refresh = function () {
    this.copyArr = arr.slice(0)
  }
  this.choose = function () {
    if (this.copyArr.length < 1) { this.copyArr = arr.slice(0) }
    const index = Math.floor(Math.random() * this.copyArr.length)
    const item = this.copyArr[index]
    this.copyArr.splice(index, 1)
    return item
  }
}

module.exports = {
  RandomChooser
}
