exports.handler = async (event) => {

  console.log(JSON.stringify(event))

  const res = event.Records[0].cf.response
  const req = event.Records[0].cf.request

  // If the user was chosen for new version, we save 999, otherwise we save the current weight
  const cookie = req.origin.s3.domainName == 'cloudfront-canary-poc-nextbucket-x2idzmcx1daj.s3.amazonaws.com' ? 999 : 50

    res.headers['Set-Cookie'] = [{key: 'Set-Cookie', value: `v2=${cookie};Max-age=151200;Path=/`}]

  return res
}
