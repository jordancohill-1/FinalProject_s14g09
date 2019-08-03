from sklearn.cluster import MiniBatchKMeans
from pathlib import Path
import numpy as np
import argparse
import cv2
import os
import glob


def quant(img):
	image = cv2.imdecode(numpy.fromstring(request.files[img].read(), numpy.uint8), cv2.IMREAD_UNCHANGED)

	#QUANT
	image = cv2.imread(str(image))
	(h, w) = image.shape[:2]
	image = cv2.cvtColor(image, cv2.COLOR_BGR2LAB)
	image = image.reshape((image.shape[0] * image.shape[1], 3))
	clt = MiniBatchKMeans(n_clusters = 4)
	labels = clt.fit_predict(image)
	quant = clt.cluster_centers_.astype("uint8")[labels]
	quant = quant.reshape((h, w, 3))
	quant = cv2.cvtColor(quant, cv2.COLOR_LAB2BGR)

	cv2.show(quant);
