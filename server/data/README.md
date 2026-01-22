# GeoLite2 Database

This folder should contain the MaxMind GeoLite2-City database for accurate IP geolocation.

## Setup

1. Create a free MaxMind account at https://www.maxmind.com/en/geolite2/signup
2. Download **GeoLite2 City** database in MMDB format
3. Place the `GeoLite2-City.mmdb` file in this folder

## Without the database

If the database is not present, the server will fall back to external APIs (ipwho.is, ipapi.co) which may be less accurate and have rate limits.

## Note

The GeoLite2 database is updated regularly. For best accuracy, download a fresh copy periodically.
