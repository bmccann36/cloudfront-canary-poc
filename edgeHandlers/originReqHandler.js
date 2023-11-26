exports.handler = async (event) => {

  console.log(JSON.stringify(event))

  const req = event.Records[0].cf.request
  let previousWeight = 0

  if (req.headers.cookie) {
    // Get the previous weight from cookie
    previousWeight = +(req.headers.cookie.find(c => c.value.startsWith(`${process.env.RELEASE_NAME}=`)) || '0').value.match('=(\\d+)')[1]
  }

  let isNext = previousWeight == 999 // 999 means the user is already on next version

  if (!isNext) {
    // Calculate the new weight considering the previous one
    const newWeight = (process.env.RELEASE_WEIGHT - previousWeight) / (100 - previousWeight)

    // Randomly decide on app version based on weight probability
    isNext = Math.random() < newWeight
  }

  if (isNext) {
    // rewrite request origin to the "next bucket"
    req.headers.host = [{key: 'host', value: req.origin.s3.domainName = process.env.NEXT_BUCKET}]
  }
  return req
}
