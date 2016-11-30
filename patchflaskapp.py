import os
import requests
import timeit
import json
from datetime import datetime
from flask import Flask, request, flash, url_for, redirect, \
     render_template, abort, send_from_directory
from flask_restful import Resource, Api, reqparse
from lxml import html

app = Flask(__name__)
api = Api(app)
LOGIN_URL = "http://patch.seal-gladius.com/login/proc_login"
session_requests = requests.session()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/<path:resource>')
def serveStaticResource(resource):
    return send_from_directory('static/', resource)


class login(Resource):
	def post(self):
		try:
			parser = reqparse.RequestParser()
			parser.add_argument('username', 
						required=True,type=str, 
						help='Username to Login')
			parser.add_argument('password',
						required=True, 
						type=str, 
						help='Password to Login')
			args = parser.parse_args()

			_userUsername = args['username']
			_userPassword = args['password']	
			
			# Create payload
			payload = { 
				"user": _userUsername,
				"pass": _userPassword
			}

			result = session_requests.post(LOGIN_URL, 
							data = payload, 
							headers = dict(referer = LOGIN_URL))
			tree = html.fromstring(result.content)
			hasil = tree.xpath("//text()")
			res = hasil[0].find("success")

			if res != -1:
				dataUser = {
					'status': 'success',
					'data': {
						'cookies': session_requests.cookies.get_dict()
						}
					}
				session_requests.cookies.clear()
				return dataUser
			else:
				return {'status':'fail',
					'data':{'message': 'Password Atau Username Salah'}}, 400

		except Exception as e:
			return {'error': str(e)},403

class buyWithSilverCoin(Resource):
	def post(self):
		try:
			parser = reqparse.RequestParser()
			parser.add_argument('item', type=str, help='id Item for buy')
			parser.add_argument('pass', type=str, help='password bank')
			parser.add_argument('cookies', type=str, help='cookies')
			args = parser.parse_args()

			#set data payload
			payload = {
				'pbnks': args['pass'],
				'id' : args['item']
			}

			#set cookie
			set_cookie = {
				'PHPSESSID': args['cookies']
			}

			URLBUY = "http://patch.seal-gladius.com/inc_/buy"
			result = session_requests.post(URLBUY,cookies= set_cookie, 
							data = payload, 
							headers = dict(referer = URLBUY))
			return {'result':'Cek Bank'}

		except Exception as e:
			return {'status':'error','data': {'message':str(e)}},403

class buyWithSilverCoinTryLoop(Resource):
	def post(self):
		try:
			start_time = timeit.default_timer()
			
			parser = reqparse.RequestParser()
			parser.add_argument('item', type=str, help='id Item for buy')
			parser.add_argument('pass', type=str, help='password bank')
			parser.add_argument('jumlah', type=int, help='jumlah loop')
			parser.add_argument('cookies', type=str, help='cookies')
			args = parser.parse_args()

			#set data payload
			payload = {
				'passbank': args['pass'],
				'idmall' : args['item'],
				"is_ajax"  : 1
			}

			#set cookie
			set_cookie = {
				'PHPSESSID': args['cookies']
			}
			jumlah = args['jumlah']
			URLBUY = "http://seal-gladius.com//itemmall-bayarr"
			allresult = []

			i = 1
			while (i <= jumlah):

				result = session_requests.post(URLBUY,cookies= set_cookie, 
								data = payload, 
								headers = dict(referer=URLBUY))
				tree = html.fromstring(result.content)
				hasil = tree.xpath("//text()")
				elapsed = float("%.3f" % (timeit.default_timer() - start_time))

				if hasil[0] == 'Failed buy!, your bank is full!':
					datas = 'BankFull'
				elif hasil[0] == 'Success Buy!, check bank at slot ':
					datas = hasil[0]+hasil[1]
				else :
					return {'status':'fail','time':elapsed,
						'data':{'message': 'Failed'}},403

				allresult.append(datas)
				if jumlah == i:
					return {'status':'success',
						'time':elapsed,
						'data':allresult }
				i+= 1
				
		except Exception as e:
			return {'status':'error','data': {'message':str(e)}},403

class buyItemMall(Resource):
	def post(self):
		try:
			parser = reqparse.RequestParser()
			parser.add_argument('item', type=str, help='id Item for buy')
			parser.add_argument('pass', type=str, help='password bank')
			parser.add_argument('cookies', type=str, help='cookies')
			args = parser.parse_args()

			#set data payload
			payload = {
				'passbank': args['pass'],
				'idmall' : args['item'],
				"is_ajax"  : 1
			}

			#set cookie
			set_cookie = {
				'PHPSESSID': args['cookies']
			}

			URLBUY = "http://seal-gladius.com//itemmall-bayar"
			result = session_requests.post(URLBUY,cookies= set_cookie, 
							data = payload, 
							headers = dict(referer = URLBUY))
			
			tree = html.fromstring(result.content)
			hasil = tree.xpath("//text()")
			print(hasil[0])
			if hasil[0] == 'Failed buy!, your bank is full!':
				return {'status':'success','data':{'result': 'Bank Full'}}
			elif hasil[0] == 'Success Buy!, check your im bank\n\t\t\t\t\t\t\t':
				strHasil = hasil[0]
				hasilakhir = strHasil.split(',',1)
				return {'status':'success',
						'data':{'result': hasilakhir[0]+hasilakhir[1]}}
			else :
				return {'status':'fail','data':{'message': 'Failed'}},403
		except Exception as e:
			return {'error': str(e)},403

class getDataUser(Resource):
	def post(self):
		try:
			parser = reqparse.RequestParser()
			parser.add_argument('cookies', type=str, help='cookies')
			args = parser.parse_args()

			#set cookie
			set_cookie = {
				'PHPSESSID': args['cookies']
			}

			getDataUser = session_requests.get(URL,cookies= set_cookie, 
								headers = dict(referer = URL))
			tree = html.fromstring(getDataUser.content)
			cekData = tree.xpath("//center/text()")

			if cekData and cekData[0] == 'Acess Denied!':
				return {'status':'fail','data':{'error': cekData[0]}},403
			
			hasil = tree.xpath("//b/text()")
			dataUser = {
				'status':'success',
				'data':{
					'Username': hasil[0],
					'SilverCoin': hasil[1],
					'GoldCoin' : hasil[2]
				}
			}
			return dataUser

		except Exception as e:
			return {'error': str(e)},403

class getStock(Resource):
	def post(self):
		try:
			parser = reqparse.RequestParser()
			# parser.add_argument('cookies', type=str, help='cookies')
			parser.add_argument('item', type=str, help='item')
			args = parser.parse_args()

			# #set cookie
			# set_cookie = {
			# 	'PHPSESSID': args['cookies']
			# }

			idItem = args['item']
			URLITEM = "http://seal-gladius.com/itemmall-detaill?item="+idItem
			getDataUser = session_requests.get(URLITEM, 
								headers = dict(referer = URLITEM))
			tree = html.fromstring(getDataUser.content)
			cekData = tree.xpath("//p/text()")

			if not cekData:
				return {'status':'fail','data':{'error': 'Error'}},403
			
			hasil = tree.xpath("//p/text()")
			strHasil = hasil[0]
			finalResult = strHasil.split(' : ',1)
			elapsed = result.elapsed.total_seconds()
			dataUser = {
				'status':'success',
				'time' : elapsed,
				'data':{
					'name': hasil[3],
					'stok': finalResult[1]
				}
			}
			return dataUser

		except Exception as e:
			return {'error': str(e)},403

api.add_resource(login, '/login')
api.add_resource(buyWithSilverCoin,'/silvercoin')
api.add_resource(getDataUser, '/getdata')
api.add_resource(buyItemMall, '/itemmall')
api.add_resource(getStock, '/getstok')
api.add_resource(buyWithSilverCoinTryLoop, '/tryloop')

if __name__ == '__main__':
    app.run(debug=True, use_reloader=True)
