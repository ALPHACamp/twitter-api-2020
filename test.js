const a = new Promise((resolve, reject) => {
  setTimeout(resolve('a'), 5000)
})
const b = new Promise((resolve, reject) => {
  setTimeout(resolve('b'), 4000)
})
const c = new Promise((resolve, reject) => {
  setTimeout(resolve('c'), 2000)
})

Promise.all([a, b, c]).then(result => console.log(result))
