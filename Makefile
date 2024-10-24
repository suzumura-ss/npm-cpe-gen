CPE_DICTIONARY = official-cpe-dictionary_v2.3.xml
NPM_CPE_DICTIONARY = cpe-dictionary_v2.3-npm.xml

setup: $(NPM_CPE_DICTIONARY)
	yarn install
clean:
	rm -rf $(CPE_DICTIONARY) $(NPM_CPE_DICTIONARY) node_modules

$(CPE_DICTIONARY):
	curl -s https://nvd.nist.gov/feeds/xml/cpe/dictionary/$(CPE_DICTIONARY).gz | gunzip > $(CPE_DICTIONARY)

$(NPM_CPE_DICTIONARY): $(CPE_DICTIONARY)
	./bin/saxon.sh -s:$(CPE_DICTIONARY) -xsl:src/npm-only.xsl -o:$(NPM_CPE_DICTIONARY)
