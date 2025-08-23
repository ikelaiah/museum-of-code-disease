# Dangerous: public S3 bucket policy
# Ref: AWS S3 block public access
resource "aws_s3_bucket" "bad" {
  bucket = "public-bucket-demo-unsafe"
  acl    = "public-read"
}
