<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0"
                xmlns:cpe="http://cpe.mitre.org/dictionary/2.0">
  <!-- 出力設定 -->
  <xsl:output method="xml" indent="yes" />

  <!-- ルートテンプレート -->
  <xsl:template match="/">
    <cpe-list>
      <!-- cpe-itemタグを抽出 -->
      <xsl:apply-templates select="//cpe:cpe-item[cpe:references/cpe:reference[starts-with(@href, 'https://www.npmjs.com')]]" />
    </cpe-list>
  </xsl:template>

  <!-- cpe-itemタグの処理 -->
  <xsl:template match="cpe:cpe-item">
    <xsl:copy>
      <xsl:copy-of select="@*|node()" />
    </xsl:copy>
  </xsl:template>

</xsl:stylesheet>
