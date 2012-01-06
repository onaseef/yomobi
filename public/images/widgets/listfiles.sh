#!/bin/sh

SUFFIX="png"

for i in *.$SUFFIX
do
	echo -ne '{ name: ' 
	echo -ne ${i%%} 
	echo -ne ', pname: ' 
	echo -ne ${i%%} 
	echo ' }'
done
# echo -ne ${i%%.$SUFFIX} | sed 's#^.*/##'
