title=Membuat fitur help-me dengan menggunakan Dunst
description=Dunst merupakan sebuah lightweight notification-daemon atau lebih gampangnya sebuah software yang akan menampilkan notifikasi di laptop.
image=https://github.com/raffifu/raffifu.github.io/assets/22138274/f0d586f6-8a03-49cc-b5e3-26edade6e85c
date=2023-05-23
type=post
status=published
~~~~~~

Tulisan ini terinspirasi dari blog ["BanditHijo - Memanfaatkan Dunst Sebagai PopUp Notifikasi Bantuan Keyboard Shortcut"](https://bandithijo.dev/blog/dunst-sebagai-notifikasi-bantuan-pengingat-shortcut). Kali ini saya akan modifikasi tutorial tersebut dengan menggunakan `wofi` sebagai launcher pengganti `rofi` di wayland.

# Apa itu dunst?
Dunst merupakan sebuah *lightweight notification-daemon* atau lebih gampangnya sebuah software yang akan menampilkan notifikasi di laptop. Kita dapat mengirimkan notifikasi melalui terminal dengan `dunstify`, previewnya kaya gini:

![dunstify](https://github.com/raffifu/raffifu.github.io/assets/22138274/c47c54ee-5269-41dc-b91b-b40c5bb8388d)

Ide pembuatan dunst sebagai helper adalah dengan mengirimkan isi sebuah file sebagai body text ke `dunstify`. File tersebut akan kita asumsikan sebagai `helper file` yang terletak di folder `$HOME/helper/`. Contohnya, kode berikut digunakan untuk menampilkan semua file berekstensi `*.md` di folder tersebut.

```sh
$ basename --suffix=.md -- *.md
```

![Output of basename command](https://github.com/raffifu/raffifu.github.io/assets/22138274/74b79161-fcac-4724-be2a-579152fbf6c0)

Selanjutnya, kita akan memilih file yang akan ditampilkan dengan mode dmenu pada `wofi`. Caranya adalah dengan menambahkan parameter `-d` untuk mengaktifkan dmenu mode dan parameter `-p "Need Help?"` sebagai placeholder input text `wofi`

```sh
$ wofi -d -p "Need help?"
```

![Preview of wofi command](https://github.com/raffifu/raffifu.github.io/assets/22138274/0fc4cd45-29d2-4658-8176-45972c71001b)

Dari preview diatas, tidak muncul apapun, Hal ini karena mode dmenu pada `wofi` mensyaratkan input berupa `stdin`. Jadi, kita akan gabungkan perintah `basename` sebagai input ke `wofi` kodenya akan seperti ini

```sh
$ basename --suffix=.md -- *.md | wofi -d -p "Need help?"
```

![Preview of combination command basename and wofi](https://github.com/raffifu/raffifu.github.io/assets/22138274/c3ab0da6-c8f7-4581-8f5f-41fb26555227)

Command `wofi` akan menampilkan output berupa nama dari `helper file`. nama file ini yang akan diprint dan dikirimkan ke `dunst` dengan cara menggabungkan script menjadi

```sh
#!/bin/bash

helper_file=$(basename --suffix=.md -- *.md | wofi -d -p "Need help?")

dunstify "Result: " "cat $helper_file.md"
```

![Final Script](https://github.com/raffifu/raffifu.github.io/assets/22138274/1b05e66d-a43f-4906-8664-a42c7e83f072)

# Final script
Dengan menambahkan pengecekan folder dan file, maka keseluruhan script yang dibuat adalah sebagai berikut
```sh
#!/bin/bash

DIR_HELPER="$HOME/helper/"

if ! [ -d $DIR_HELPER ]; then
	echo "DIR_HELPER Not Found"
	exit 1
fi

cd $DIR_HELPER

helper_file=$(basename --suffix=.md -- *.md | wofi -d -p "Need Help?")

# check if file exist not null
if ! [ -f "$DIR_HELPER/$helper_file.md" ]; then
	echo "Not Found"
	exit 1
fi

dunstify "⭐⭐⭐" "$(cat "$DIR_HELPER/$helper_file.md")
```
Simpan file ini dengan nama `help-me` dan masukkan ke dalam `$PATH` variabel. Kemudian dapat dibuat shortcut, contohnya pada `sway` dengan cara
```
bindsym $mod+Shift+slash exec help-me
```

Semoga bermanfaat
````
