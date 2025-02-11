# USAGE
# python quant.py --image images/worldcup.jpg --clusters 4

# import the necessary packages
from sklearn.cluster import MiniBatchKMeans
from pathlib import Path
import numpy as np
import argparse
import cv2
import os
import glob


directory = glob.iglob("/Users/jordancohill/Desktop/WebApps/Final_data/small/*.jpg")
for file in directory:
    filename = os.path.basename(file)

# load the image and grab its width and height
    image = cv2.imread(str(file))
    (h, w) = image.shape[:2]

    # convert the image from the RGB color space to the L*a*b*
    # color space -- since we will be clustering using k-means
    # which is based on the euclidean distance, we'll use the
    # L*a*b* color space where the euclidean distance implies
    # perceptual meaning
    image = cv2.cvtColor(image, cv2.COLOR_BGR2LAB)

    # reshape the image into a feature vector so that k-means
    # can be applied
    image = image.reshape((image.shape[0] * image.shape[1], 3))

    # apply k-means using the specified number of clusters and
    # then create the quantized image based on the predictions
    clt = MiniBatchKMeans(n_clusters = 4)
    labels = clt.fit_predict(image)
    quant = clt.cluster_centers_.astype("uint8")[labels]

    # reshape the feature vectors to images
    quant = quant.reshape((h, w, 3))

    # convert from L*a*b* to RGB
    quant = cv2.cvtColor(quant, cv2.COLOR_LAB2BGR)


    # display the images and wait for a keypress
    #cv2.imshow("image", np.hstack([quant]))

    path = "/Users/jordancohill/Desktop/Quant/test"
    cv2.imwrite(os.path.join(path , filename), quant)

    #cv2.waitKey(0)
