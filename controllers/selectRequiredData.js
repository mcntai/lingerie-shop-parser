const get = key => obj => obj[key]

const composePhotoUrls = data => {
  return data.media.map(el => el.fullUrl.replace('fill', 'fit')).join(';')
}

const composeCharacteristics = data => {
  return data.options.map(o => ({
    title: o.title,
    value: o.selections.map(s => s.description).join(';'),
  }))
}

const productDetailsMap = {
  description: get('description'),
  price      : get('price'),
  name       : get('name'),
  photo      : composePhotoUrls,
  options    : composeCharacteristics,
}

const selectRequiredData = rawDataObj => {
  const newObj = {}

  Object.entries(productDetailsMap).forEach(product => {
    const [prop, func] = product
    newObj[prop] = func(rawDataObj)
  })

  return newObj
}

module.exports = selectRequiredData