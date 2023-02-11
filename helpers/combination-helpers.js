function followshipCombinationHelper (arr, times) {
  let allCombinations = []// 可能的全部組合
  const indexArr = arr.map((_, index) => {
    return index
  })

  for (let i = 0; i < indexArr.length; i++) {
    const sliced = indexArr.splice(i, 1)
    const combinations = indexArr.map(item => {
      return [sliced[0], item]
    })
    indexArr.splice(i, 0, sliced[0])
    allCombinations = allCombinations.concat(combinations)
  }// 跑完陣列後得到全部的組合

  const result = []// 另開一個空陣列
  for (let i = 0; i < times; i++) { // times = 要抽幾組
    const randomNum = Math.floor(Math.random() * allCombinations.length)
    result.push(allCombinations.splice(randomNum, 1)[0]) // 舊陣列去除數字轉移到新陣列
  }
  return result // 會得到類似[[ [ 0, 1 ], [ 0, 2 ], [ 1, 0 ], [ 2, 1 ] ......] 的陣列 (帶入函式的arr = [1,2,3])
}

function likeCombinationHelper (arr1, arr2, times) {
  let allCombinations = []// 可能的全部組合
  const indexArr1 = arr1.map((_, index) => {
    return index
  })
  const indexArr2 = arr2.map((_, index) => {
    return index
  })

  for (let i = 0; i < indexArr1.length; i++) {
    for (let j = 0; j < indexArr2.length; j++) {
      allCombinations = allCombinations.concat([[i, j]])
    }
  }
  console.log(allCombinations)
  const result = []// 開另一個空陣列

  for (let i = 0; i < times; i++) {
    const randomNum = Math.floor(Math.random() * allCombinations.length)
    result.push(allCombinations.splice(randomNum, 1)[0]) // 舊陣列去除數字轉移到新陣列
  };
  return result
}

module.exports = {
  followshipCombinationHelper,
  likeCombinationHelper
}
