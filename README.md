# author: klaudiusz.skowronski mail: claude-plos@o2.pl
# GUS API - JavaScript
Prosta app, korzystająca z GUS API w celu pobrania danych firmy (adresy itp) po podaniu numeru NIP.

## Działanie

    //adresy produkcyjne
     $loginUrl = 'https://wyszukiwarkaregon.stat.gov.pl/wsBIR/UslugaBIRzewnPubl.svc/ajaxEndpoint/Zaloguj';
     $searchDataUrl = 'https://wyszukiwarkaregon.stat.gov.pl/wsBIR/UslugaBIRzewnPubl.svc/ajaxEndpoint/daneSzukaj';
    //adresy testowe
     $loginTestUrl = 'https://wyszukiwarkaregontest.stat.gov.pl/wsBIR/UslugaBIRzewnPubl.svc/ajaxEndpoint/Zaloguj';
     $searchDataTestUrl = 'https://wyszukiwarkaregontest.stat.gov.pl/wsBIR/UslugaBIRzewnPubl.svc/ajaxEndpoint/daneSzukaj';
```

protected $key = "abcde12345abcde12345"; //key for a test
```
