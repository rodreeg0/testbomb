import requests
import urllib
import smtplib, ssl as ssl, email
import time
import datetime
from requests.structures import CaseInsensitiveDict

url = "https://api.fishytank.io/rpc"

while True:
    x = requests.get('https://flowaxs.ga')
    print(x.content)
    time.sleep(3660)
# headers = CaseInsensitiveDict()
# headers["authority"] = "api.fishytank.io"
# headers["sec-ch-ua"] = '"Chromium";v="94", "Google Chrome";v="94", ";Not A Brand";v="99"'
# headers["referrer-policy"] = "no-referrer"
# headers["content-type"] = "application/json"
# headers["sec-ch-ua-mobile"] = "?0"
# headers["user-agent"] = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36"
# headers["sec-ch-ua-platform"] = "Windows"
# headers["accept"] = "*/*"
# headers["origin"] = "https://app.fishytank.io"
# headers["sec-fetch-site"] = "same-site"
# headers["sec-fetch-mode"] = "cors"
# headers["sec-fetch-dest"] = "empty"
# headers["referer"] = "https://app.fishytank.io/"
# headers["accept-language"] = "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7"

# data = '{"name":"feed_for_fish","data":"ZWgsFJJiQnJPdZXnKoqBN8iCYDg1e+GjT1OTFWUp/n54DzuM2XMH4rrIADSyuf2Erx2GgMn1OX1vkmjg+6G9kaWj/dFRTdhLoCjy+CxLFBI2b3XI5UOmiQgFNHFxuiTHGkJP8kjMEsY="}'


# resp = requests.post(url, headers=headers, data=data)

# print(resp.content)

