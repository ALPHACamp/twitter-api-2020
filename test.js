const bbb = Date.now()
for (let i = 0; i < 10; i++) {
  const aaa = new Date(bbb + i * 1000)
  console.log(bbb)
  console.log(aaa)
}
// 我也不知為何非要用 new，做成物件不可？

// const aaa = new Date(,,, , , 100, )
// console.log('Date(bbb)')
// console.log('Date(bbb)')
// console.log(bbb)
// console.log(bbb + 1000000)
// console.log('Date(bbb)')
// console.log('Date(bbb)')
// console.log(new Date(bbb))
// console.log(new Date(bbb + 1000000))
// console.log(new Date(0))
// console.log(aaa + 100)
