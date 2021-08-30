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

const productInfoMap = {
  description: get('description'),
  price      : get('price'),
  name       : get('name'),
  photo      : composePhotoUrls,
  options    : composeCharacteristics,
}

const grabData = data => {
  const newObj = {}

  Object.entries(productInfoMap).forEach(product => {
    const [prop, func] = product
    newObj[prop] = func(data)
  })

  return newObj
}

module.exports = grabData