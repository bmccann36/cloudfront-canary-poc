exports.handler = async (event) => {

  // console.log(JSON.stringify(event))

  const req = event.Records[0].cf.request
  let previousWeight = 0

  if (req.headers.cookie) {
    // Get the previous weight from cookie
    previousWeight = +(req.headers.cookie.find(c => c.value.startsWith('v2=')) || '0').value.match('=(\\d+)')[1]
  }

  let serveNextVersion = previousWeight == 999 // 999 means the user is already on next version

  if (!serveNextVersion) {

    console.log('next not set')
    // Calculate the new weight considering the previous one
    const newWeight = (50 - previousWeight) / (100 - previousWeight)

    // Randomly decide on app version based on weight probability
    serveNextVersion = Math.random() < newWeight
  }
  console.log('>>serveNextVersion', serveNextVersion);

  if (serveNextVersion) {
    // rewrite request origin to the "next bucket"
    req.headers.host = [{
      key: 'host',
      value: req.origin.s3.domainName = 'cloudfront-canary-poc-nextbucket-x2idzmcx1daj.s3.us-east-1.amazonaws.com'
    }]
    // or else it will be: cloudfront-canary-poc-currentbucket-9tteolqz6fi8.s3.us-east-1.amazonaws.com
  }
  return req
}
