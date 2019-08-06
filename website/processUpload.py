from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
from sklearn.cluster import MiniBatchKMeans
from pathlib import Path
from colorthief import ColorThief
import numpy as np
import trainTest
import pandas as pd
import argparse
import cv2
import os
import glob
import webcolors
import json
import face_recognition
import imutils
from PIL import Image, ImageDraw, ImageFont
import psycopg2

upload_path = 'UPLOAD_FOLDER'
path = 'static/images/uploads'
colorRange = json.load(open('colorRange.json'))

def process(img):
	# path to uploaded image
	pathToFile = os.path.join(upload_path, img)

	quant_results = quant(img, pathToFile)
	face_results = face(img, pathToFile)

	# merge dicts
	quant_results.update(face_results)
	results = quant_results

	print(results)

	return results

def face(img, pathToFile):
	# connection to database
	conn = psycopg2.connect(database='s14g09_IMDB_ColorPrediction', user='s14g09', password="s14g09_Master", host='movie.cdnh3cwt5np2.us-east-1.rds.amazonaws.com', port='5432')

	# connet to DB
	cur = conn.cursor()

	# get list of nconsts from DB
	cur.execute('SELECT nconst from actors')
	known_face_nconsts = cur.fetchall()

	# get list of face encodings from DB, convert from json to list
	cur.execute('SELECT face_encoding from actors')
	db_face_encodings = cur.fetchall()
	db_face_encodings = list(db_face_encodings)

	# set up know face encodings array
	known_face_encodings = []

	# process all tuple face encodings from db
	for i, face_encoding in enumerate(db_face_encodings):
		# turn into properly formatted numpy array
		face_encoding = list(face_encoding[0])
		face_encoding = np.array(face_encoding)

		# convert face_encoding to numpy array
		face_encoding = np.array(face_encoding)

		# add to known face encodings array
		known_face_encodings.append(face_encoding)

		origPath = os.path.join(path, "original-face.jpg")
		newPath = os.path.join(path, "processed-face.jpg")

	#scale down image for processing
	image = cv2.imread(pathToFile, 0)
	image = imutils.resize(image, height=1000)

	# temporarily write image to disk
	cv2.imwrite(origPath, image)

	# load image
	image = face_recognition.load_image_file(origPath)

	# find faces, store number of faces
	face_locations = face_recognition.face_locations(image)
	num_faces = len(face_locations)

	# create face encodings of each found faces
	face_encodings = face_recognition.face_encodings(image, face_locations)

	# set up identified actors array
	identified_actors = []

	# convert to PIL format image and init draw instance
	pil_image = Image.fromarray(image)
	draw = ImageDraw.Draw(pil_image)

	# process each face found
	for (top, right, bottom, left), face_encoding in zip(face_locations, face_encodings):
		# dimensions
		left -= 20
		top -= 20
		right += 20
		bottom += 20

		# find possible matches
		matches = face_recognition.compare_faces(known_face_encodings, face_encoding, tolerance=0.5)

		name = "Unknown"

		# get euclidean distance for the face
		face_distances = face_recognition.face_distance(known_face_encodings, face_encoding)

		# find known face with smallest distance
		best_match_index = np.argmin(face_distances)
		if matches[best_match_index]:
			# associate known face with nconst
			nconst = known_face_nconsts[best_match_index][0]

			# find actor ID via nconst and extract value
			cur.execute("""SELECT name from actors WHERE nconst = '{}'""".format(nconst))
			name = cur.fetchone()
			name = name[0]

			# add name to identiifed actors array
			identified_actors.append(name)

		# draw rectangle over face
		draw.rectangle(((left, top), (right, bottom)), outline=(0, 0, 255))

		# font size configuration
		fontsize = 1
		img_fraction = 0.10

		# calculate font size
		font = ImageFont.truetype("BarlowSemiCondensed-Medium.ttf", fontsize)
		while font.getsize(name)[0] < img_fraction*pil_image.size[0]:
			fontsize += 1
			font = ImageFont.truetype("BarlowSemiCondensed-Medium.ttf", fontsize)

		# Draw a label with a name below the face
		text_width, text_height = draw.textsize(name, font=font)
		draw.rectangle(((left, bottom - text_height - 10), (right, bottom)), fill=(0, 0, 255), outline=(0, 0, 255))
		draw.text((left + 6, bottom - text_height - 10), name, fill=(255, 255, 255, 255), font=font)

	# delete draw instance
	del draw

	# save image to disk
	pil_image.save(newPath)

	# return results in a dict
	results = {'num_faces': num_faces, 'identified_actors': identified_actors}
	return results

def quant(img, pathToFile):
	origPath = os.path.join(path, "original.jpg")
	newPath = os.path.join(path, "quant.jpg")

	#QUANT
	image = cv2.imread(pathToFile)
	scale_percent = 40 
	width = int(image.shape[1] * scale_percent / 100)
	height = int(image.shape[0] * scale_percent / 100)
	dim = (width, height)
	image = cv2.resize(image, dim, interpolation = cv2.INTER_AREA)
	originalImage = image
	(h, w) = image.shape[:2]
	image = cv2.cvtColor(image, cv2.COLOR_BGR2LAB)
	image = image.reshape((image.shape[0] * image.shape[1], 3))
	clt = MiniBatchKMeans(n_clusters = 4)
	labels = clt.fit_predict(image)
	quant = clt.cluster_centers_.astype("uint8")[labels]
	quant = quant.reshape((h, w, 3))
	quant = cv2.cvtColor(quant, cv2.COLOR_LAB2BGR)

	cv2.imwrite( origPath, originalImage)
	cv2.imwrite( newPath, quant)
	results = dominantColors(pathToFile)

	return results

def dominantColors(path):
	color_thief = ColorThief(path)
	dominant_color = color_thief.get_color(quality=1)

	def closest_colour(dominant_color):
		min_colours = {}
		for key, name in webcolors.css3_hex_to_names.items():
			r_c, g_c, b_c = webcolors.hex_to_rgb(key)
			rd = (r_c - dominant_color[0]) ** 2
			gd = (g_c - dominant_color[1]) ** 2
			bd = (b_c - dominant_color[2]) ** 2
			min_colours[(rd + gd + bd)] = name
		return min_colours[min(min_colours.keys())]

	def get_colour_name(dominant_color):
		try:
			actual_name = webcolors.rgb_to_name(dominant_color, spec='css3')
			closest_name = None
		except ValueError:
			closest_name = closest_colour(dominant_color)
			actual_name = None
		return actual_name, closest_name

	actual_name, closest_name = get_colour_name(dominant_color)

	if(actual_name == None):
		colorName = closest_name
	else:
		colorName = actual_name

	exactName = colorName

	def get_general_name(colorName):
		for item in colorRange:
			if colorName in item["css3_colors"]:
				general_name = item["parent_color"]
				return general_name

	general_name = get_general_name(colorName)

	print(exactName, general_name)
	results = {'dominant_color': exactName, 'general_color': general_name}
	results.update(trainTest.predict(general_name))
	return results

def clearDir():
	files = os.listdir(path)
	for f in files:
		os.remove(path +"/" + f)