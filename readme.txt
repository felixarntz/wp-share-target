=== Share Target ===

Contributors:      flixos90
Requires at least: 5.2
Tested up to:      5.7
Requires PHP:      7.0
Stable tag:        1.0.0
License:           GNU General Public License v2 (or later)
License URI:       https://www.gnu.org/licenses/gpl-2.0.html
Tags:              image, media, sharing, web, share target, api, progressive, pwa

Allows to share images and other content directly to a WordPress site through the Web Share Target API.

== Description ==

By using this plugin, you can share content like images, media, URLs and text directly to your WordPress site from a [capable device and browser](https://caniuse.com/web-app-manifest). For example, you can share a photo that you just took on your phone to your WordPress site in the same way that you would otherwise share it with your friends in a native messaging app.

When you share content to your WordPress site using this plugin, it will automatically start a new block editor draft post with it; you can then just add anything else you like, or immediately publish it as is. For certain use-cases, e.g. an image blog, creating a post with the shared image might be everything that's needed before publishing right away!

To name a few other examples of what you can share to your WordPress site using this plugin, think about audio and video files, short text notes, Spotify playlists - basically anything that you can share from an app on your phone you can now also share directly to your WordPress site.

= Requirements =

In order to use this plugin, you will also need to install and activate the [PWA plugin](https://wordpress.org/plugins/pwa/), which provides the basic infrastructure for your site to become a PWA.

= Usage =

With both plugins active, once you visit your site on a [capable device and browser](https://caniuse.com/web-app-manifest), you should see a prompt (via the PWA plugin's functionality) to add the plugin to your home screen (e.g. similar to an app on your phone).

Once you have added your website to the home screen of your device, it should be available as a target when sharing any content from that device, e.g. a photo or a URL.

When you share something to your WordPress site, the installed PWA of your website should open. You should then (potentially after logging in) land directly on a new post in the block editor where the shared content has already been added. If you are sharing a media file (e.g. an image or video file), it will be automatically added to your site's media library.

= Background information =

This plugin is powered by the Web Share Target API. The [Web Share Target API](https://web.dev/web-share-target/) is a modern browser API which allows sharing images, media, URLs and basic text content directly to your website, relying on the regular sharing UI that is for example integrated in your phone. [See here for more technical background information about the Web Share Target API.](https://w3c.github.io/web-share-target/)

= Third-party developer API =

TODO.

== Installation ==

**Make sure you have the [PWA plugin](https://wordpress.org/plugins/pwa/) installed before using the Share Target plugin.**

1. Upload the entire `share-target` folder to the `/wp-content/plugins/` directory or download it through the WordPress backend.
2. Activate the plugin through the 'Plugins' menu in WordPress.

== Frequently Asked Questions ==

= Why does my website not show up as a target for shared content? =

In order for your website to show up in your device's integrated sharing UI, you need to install your website as a PWA on your device. Make sure to use a [browser and OS that supports adding your website as a PWA to your homescreen](https://caniuse.com/web-app-manifest).

= Where should I submit my support request? =

For regular support requests, please use the [wordpress.org support forums](https://wordpress.org/support/plugin/share-target). If you have a technical issue with the plugin where you already have more insight on how to fix it, you can also [open an issue on Github instead](https://github.com/felix-arntz/wp-share-target/issues).

= How can I contribute to the plugin? =

If you have some ideas to improve the plugin or to solve a bug, feel free to raise an issue or submit a pull request in the [Github repository for the plugin](https://github.com/felix-arntz/wp-share-target). Please stick to the [contributing guidelines](https://github.com/felix-arntz/wp-share-target/blob/main/CONTRIBUTING.md).

You can also contribute to the plugin by translating it. Simply visit [translate.wordpress.org](https://translate.wordpress.org/projects/wp-plugins/share-target) to get started.

== Screenshots ==

1. Sharing media and text from a notes app on the phone directly into a WordPress site about cocktails
2. The shared content from the other screenshot as initially displayed in the block editor, with only one click left to publish

== Changelog ==

= 1.0.0 =

* Initial release
