const chalk = require('chalk')

module.exports = (tasks, limit) => {
  const total = tasks.length

  if (!tasks.length) {
    return
  }

  if (!limit) {
    throw new Error('[limit] is not set')
  }

  return new Promise((resolve, reject) => {
    let i = -1
    let running = 0
    let done = false

    const results = []

    const onTaskComplete = index => result => {
      results[index] = result
      running--

      if (!running && done) {
        return resolve(results)
      }

      replenish()
    }

    const iteratee = i =>
      Promise.resolve()
        .then(() => {
          if (typeof tasks[i] !== 'function') {
            console.log(chalk.bgRed(tasks[i]))
          }

          return tasks[i]()
        })
        .then(onTaskComplete(i), reject)

    const replenish = () => {
      while (running < limit && !done) {
        i += 1

        if (i >= total) {
          done = true

          if (running <= 0) {
            resolve(results)
          }

          return
        }

        running += 1

        // noinspection JSIgnoredPromiseFromCall
        iteratee(i)
      }
    }

    replenish()
  })
}