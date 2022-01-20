const crypto = require('crypto');

function getFingerprint(certificate, inputEncoding = "utf8", outputEncoding="base64", hash="sha1") {
  const content =  certificate.toString().split("\n").filter(line => !line.includes("-----"))
          .map(line => line.trim() )
          .join("");
  const shasum = crypto.createHash(hash);
  shasum.update(content, inputEncoding);

  return shasum.digest(outputEncoding);
};

exports.getFingerprint = getFingerprint;