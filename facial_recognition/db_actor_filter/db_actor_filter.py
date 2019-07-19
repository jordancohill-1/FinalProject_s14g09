#
# DB Actor Filter
# Filters database for only actors/actresses and exports results to CSV file
# Author: Phillip T.
#

###########
# OPTIONS #
###########

source_dataset = 'source_files/names.basics.csv'
nconsts_file = 'source_files/nconsts.json'
destination = 'dataset/imdb_actors.csv'

################################################################################

import pandas as pd
import json

# load source file
print('[INIT] reading source dataset')
df = pd.read_csv(source_dataset)
print('[DONE] source dataset read')

# load top 1000 actors
print('[INIT] loading top 1000 actors')
with open('source_files/nconsts.json') as json_file:
  data = json.load(nconsts_file)
print('[DONE] top 1000 actors loaded')

# find top 1000 actors in dataset
print('[INIT] finding top 1000 actors in dataset')
df = df[df['nconst'].isin(data)]
print('[DONE] top 1000 actors found in dataset')

# include only necessary nconst and name columns
print('[INIT] filter dataset for nconst and name')
df = df[['nconst', 'primaryName']]
print('[DONE] nconst and name filtered')

# export to CSV file
print('[INIT] exporting database')
df.to_csv(destination, index=False)
print('[DONE] database exported')
