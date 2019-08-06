from sklearn.externals import joblib
from sklearn import datasets, linear_model, preprocessing
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeRegressor
from routes import dataset
import numpy as np
import pandas as pd

destination = "results.csv"


def predict(color):
	regr = linear_model.LinearRegression()
	regr_dtr = DecisionTreeRegressor(random_state=0)	
	le = preprocessing.LabelEncoder()
	enc = preprocessing.OneHotEncoder()

	data = dataset()#data from routes so we aren't connecting to DB again


	colors = data['dominant_color_name'].str.get_dummies()
	scores = data['imdb_score']
	#print(colors)


	#Train Test Splits
	colors_train, colors_test, scores_train, scores_test = train_test_split(colors, scores, test_size=0.33)
	# Train
	regr.fit(colors_train, scores_train)
	regr_dtr.fit(colors_train, scores_train)

	# Outcome prediction, score
	score = regr.score(colors_test, scores_test)
	score_dtr = regr_dtr.score(colors_test, scores_test)
	print(score)
	print(score_dtr)


	#fill array for encoded colors 
	index = colors.columns.get_loc(color)
	print(index)
	x=[]
	for i in range(0, 12):
		if(i == index):
			x.append(1)#input color
		else:
			x.append(0)


	#prediction
	score_predict = regr.predict([x])
	print(score_predict)




