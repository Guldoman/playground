# Lite XL Playground

This repository contains files needed to run Lite XL in the browser.
Lite XL includes a shell file that does the job pretty well,
but the aim here is to improve the experience more by making it actually
useful.

## Instructions

This repository is still a work-in-progress, so detailed instructions on how
to set up everything is not available.

In general, you will need the following tools:

- Emscripten (optionally emsdk) 3.1.57 and newer. Older versions will not work.
- file_packager (Installed with Emscripten if emsdk is used)
- A HTTP Server (I use `http-server`, but Python's `http.server` will work with caveats.)
- Git
- Bash (MSYS2 might work but not tested)
- npm

You can find specific documentation in each subfolder.

<details>
<summary>Original README</summary>

# Lite XL

[![CI]](https://github.com/lite-xl/lite-xl/actions/workflows/build.yml)
[![Discord Badge Image]](https://discord.gg/UQKnzBhY5H)

![screenshot-dark]

A lightweight text editor written in Lua, adapted from [lite].

* **[Get Lite XL]** — Download for Windows, Linux and Mac OS.
* **[Get plugins]** — Add additional functionality, adapted for Lite XL.
* **[Get color themes]** — Add additional colors themes.

Please refer to our [website] for the user and developer documentation,
including [build] instructions details. A quick build guide is described below.

Lite XL has support for high DPI display on Windows and Linux and,
since 1.16.7 release, it supports **retina displays** on macOS.

Please note that Lite XL is compatible with lite for most plugins and all color themes.
We provide a separate lite-xl-plugins repository for Lite XL, because in some cases
some adaptations may be needed to make them work better with Lite XL.
The repository with modified plugins is https://github.com/lite-xl/lite-xl-plugins.

The changes and differences between Lite XL and rxi/lite are listed in the
[changelog].

## Overview

Lite XL is derived from [lite].
It is a lightweight text editor written mostly in Lua — it aims to provide
something practical, pretty, *small* and fast easy to modify and extend,
or to use without doing either.

The aim of Lite XL compared to lite is to be more user friendly,
improve the quality of font rendering, and reduce CPU usage.

## Customization

Additional functionality can be added through plugins which are available in
the [plugins repository] or in the [Lite XL plugins repository].

Additional color themes can be found in the [colors repository].
These color themes are bundled with all releases of Lite XL by default.

## Quick Build Guide

If you compile Lite XL yourself, it is recommended to use the script
`build-packages.sh`:

```sh
bash build-packages.sh -h
```

The script will run Meson and create a tar compressed archive with the application or,
for Windows, a zip file. Lite XL can be easily installed
by unpacking the archive in any directory of your choice.

Otherwise the following is an example of basic commands if you want to customize
the build:

```sh
meson setup --buildtype=release --prefix <prefix> build
meson compile -C build
DESTDIR="$(pwd)/lite-xl" meson install --skip-subprojects -C build
```

where `<prefix>` might be one of `/`, `/usr` or `/opt`, the default is `/`.
To build a bundle application on macOS:

```sh
meson setup --buildtype=release --Dbundle=true --prefix / build
meson compile -C build
DESTDIR="$(pwd)/Lite XL.app" meson install --skip-subprojects -C build
```

Please note that the package is relocatable to any prefix and the option prefix
affects only the place where the application is actually installed.

## Installing Prebuilt

Head over to [releases](https://github.com/lite-xl/lite-xl/releases) and download the version for your operating system.

The prebuilt releases supports the following OSes:

- Windows 7 and above
- Ubuntu 18.04 and above (glibc 2.27 and above)
- OS X El Capitan and above (version 10.11 and above)

Some distributions may provide custom binaries for their platforms.

### Windows

Lite XL comes with installers on Windows for typical installations.
Alternatively, we provide ZIP archives that you can download and extract anywhere and run directly.

To make Lite XL portable (e.g. running Lite XL from a thumb drive),
simply create a `user` folder where `lite-xl.exe` is located.
Lite XL will load and store all your configurations and plugins in the folder.

### macOS

We provide DMG files for macOS. Simply drag the program into your Applications folder.

> **Important**
> Newer versions of Lite XL are signed with a self-signed certificate,
> so you'll have to follow these steps when running Lite XL for the first time.
>
> 1. Find Lite XL in Finder (do not open it in Launchpad).
> 2. Control-click Lite XL, then choose `Open` from the shortcut menu.
> 3. Click `Open` in the popup menu.
>
> The correct steps may vary between macOS versions, so you should refer to
> the [macOS User Guide](https://support.apple.com/en-my/guide/mac-help/mh40616/mac).
>
> On an older version of Lite XL, you will need to run these commands instead:
> 
> ```sh
> # clears attributes from the directory
> xattr -cr /Applications/Lite\ XL.app
> ```
>
> Otherwise, macOS will display a **very misleading error** saying that the application is damaged.

### Linux

Unzip the file and `cd` into the `lite-xl` directory:

```sh
tar -xzf <file>
cd lite-xl
```

To run lite-xl without installing:

```sh
./lite-xl
```

To install lite-xl copy files over into appropriate directories:

```sh
rm -rf  $HOME/.local/share/lite-xl $HOME/.local/bin/lite-xl
mkdir -p $HOME/.local/bin && cp lite-xl $HOME/.local/bin/
mkdir -p $HOME/.local/share/lite-xl && cp -r data/* $HOME/.local/share/lite-xl/
```

#### Add Lite XL to PATH

To run Lite XL from the command line, you must add it to PATH.

If `$HOME/.local/bin` is not in PATH:

```sh
echo -e 'export PATH=$PATH:$HOME/.local/bin' >> $HOME/.bashrc
```

Alternatively on recent versions of GNOME and KDE Plasma,
you can add `$HOME/.local/bin` to PATH via `~/.config/environment.d/envvars.conf`:

```ini
PATH=$HOME/.local/bin:$PATH
```

> **Note**
> Some systems might not load `.bashrc` when logging in.
> This can cause problems with launching applications from the desktop / menu.

#### Add Lite XL to application launchers

To get the icon to show up in app launcher, you need to create a desktop
entry and put it into `/usr/share/applications` or `~/.local/share/applications`.

Here is an example for a desktop entry in `~/.local/share/applications/com.lite_xl.LiteXL.desktop`,
assuming Lite XL is in PATH:

```ini
[Desktop Entry]
Type=Application
Name=Lite XL
Comment=A lightweight text editor written in Lua
Exec=lite-xl %F
Icon=lite-xl
Terminal=false
StartupWMClass=lite-xl
Categories=Development;IDE;
MimeType=text/plain;inode/directory;
```

To get the icon to show up in app launcher immediately, run:

```sh
xdg-desktop-menu forceupdate
```

Alternatively, you may log out and log in again.

#### Uninstall

To uninstall Lite XL, run:

```sh
rm -f $HOME/.local/bin/lite-xl
rm -rf $HOME/.local/share/icons/hicolor/scalable/apps/lite-xl.svg \
          $HOME/.local/share/applications/com.lite_xl.LiteXL.desktop \
          $HOME/.local/share/metainfo/com.lite_xl.LiteXL.appdata.xml \
          $HOME/.local/share/lite-xl
```

## Contributing

Any additional functionality that can be added through a plugin should be done
as a plugin, after which a pull request to the [Lite XL plugins repository] can be made.

Pull requests to improve or modify the editor itself are welcome.

## Licenses

This project is free software; you can redistribute it and/or modify it under
the terms of the MIT license. See [LICENSE] for details.

See the [licenses] file for details on licenses used by the required dependencies.


[CI]:                         https://github.com/lite-xl/lite-xl/actions/workflows/build.yml/badge.svg
[Discord Badge Image]:        https://img.shields.io/discord/847122429742809208?label=discord&logo=discord
[screenshot-dark]:            https://user-images.githubusercontent.com/433545/111063905-66943980-84b1-11eb-9040-3876f1133b20.png
[lite]:                       https://github.com/rxi/lite
[website]:                    https://lite-xl.com
[build]:                      https://lite-xl.com/en/documentation/build
[Get Lite XL]:                https://github.com/lite-xl/lite-xl/releases/latest
[Get plugins]:                https://github.com/lite-xl/lite-xl-plugins
[Get color themes]:           https://github.com/lite-xl/lite-xl-colors
[changelog]:                  https://github.com/lite-xl/lite-xl/blob/master/changelog.md
[Lite XL plugins repository]: https://github.com/lite-xl/lite-xl-plugins
[plugins repository]:         https://github.com/rxi/lite-plugins
[colors repository]:          https://github.com/lite-xl/lite-xl-colors
[LICENSE]:                    LICENSE
[licenses]:                   licenses/licenses.md

</details>