# CPE generator

npm管轄のパッケージに限定して、CPE文字列を生成します

- パッケージのURLは `https://www.npmjs.com/*` である必要があります
- CPE Dictionary に登録されていないパッケージは生成できません。過去に登録されていたパッケージのバージョン違いを生成します


## 使い方

1. 以下のコマンドで npmパッケージに限定した CPE Dictionary `cpe-dictionary_v2.3-npm.xml` を生成します

    ```bash
    make
    ```

    このコマンドは以下を行います

    - `yarn install`
    - [XSLT saxon](https://www.saxonica.com/welcome/welcome.xml) のインストール
        - macOS: `brew install saxon`
        - Ubuntu: `apt install default-jre libsaxonb-java`
    - <https://nvd.nist.gov/products/cpe> の `official-cpe-dictionary_v2.3.xml` のダウンロード

1. 以下のコマンドでCPE文字列を生成します

    ```bash
    yarn start https://www.npmjs.com/package/express 9.9.9
    #=>
    {
        target: 'https://www.npmjs.com/package/express',
        cpe: 'cpe:2.3:a:openjsf:express:9.9.9:*:*:*:*:node.js:*:*'
    }

    # パッケージが見つからない場合
    yarn start https://www.npmjs.com/package/cookie 9.9.9
    #=>
    {
        target: 'https://www.npmjs.com/package/cookie', cpe: undefined
    }
    ```

## macOS, Ubuntu 以外での準備

1. [XSLT saxon](https://www.saxonica.com/welcome/welcome.xml) をインストールします
1. <https://nvd.nist.gov/products/cpe> の `official-cpe-dictionary_v2.3.xml.zip` をダウンロードします
1. 展開して `official-cpe-dictionary_v2.3.xml` として保存します
1. `saxon` コマンドで変換します。具体的なオプション指定は環境によって異なります

    ```bash
    # saxonコマンドの場合
    saxon -s:official-cpe-dictionary_v2.3.xml -xsl:src/cpe-dictionary.xsl -o:cpe-dictionary_v2.3-npm.xml

    # saxon-xsltコマンドの場合
    saxon-xslt -s:official-cpe-dictionary_v2.3.xml -xsl:src/cpe-dictionary.xsl -o:cpe-dictionary_v2.3-npm.xml

    # libsaxnon-java (/usr/share/java/saxon.jar) の場合
    java -jar /usr/share/java/saxon.jar official-cpe-dictionary_v2.3.xml src/npm-only.xsl > cpe-dictionary_v2.3-npm.xml
    ```
