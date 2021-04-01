[![WordPress plugin](https://img.shields.io/wordpress/plugin/v/share-target.svg?maxAge=2592000)](https://wordpress.org/plugins/share-target/)
[![WordPress](https://img.shields.io/wordpress/v/share-target.svg?maxAge=2592000)](https://wordpress.org/plugins/share-target/)
[![License](https://img.shields.io/github/license/felixarntz/wp-share-target)](https://github.com/felixarntz/wp-share-target/blob/main/LICENSE)

# Share Target

Allows to share images and other content directly to a WordPress site through the Web Share Target API.

By using this plugin, you can share content like images, media, URLs and text directly to your WordPress site from a [capable device and browser](https://caniuse.com/web-app-manifest). For example, you can share a photo that you just took on your phone to your WordPress site in the same way that you would otherwise share it with your friends in a native messaging app.

When you share content to your WordPress site using this plugin, it will automatically start a new block editor draft post with it; you can then just add anything else you like, or immediately publish it as is. For certain use-cases, e.g. an image blog, creating a post with the shared image might be everything that's needed before publishing right away!

To name a few other examples of what you can share to your WordPress site using this plugin, think about audio and video files, short text notes, Spotify playlists - basically anything that you can share from an app on your phone you can now also share directly to your WordPress site.

## Requirements

In order to use this plugin, you will also need to install and activate the [PWA plugin](https://wordpress.org/plugins/pwa/), which provides the basic infrastructure for your site to become a PWA.

## Usage

With both plugins active, once you visit your site on a [capable device and browser](https://caniuse.com/web-app-manifest), you should see a prompt (via the PWA plugin's functionality) to add the plugin to your home screen (e.g. similar to an app on your phone).

Once you have added your website to the home screen of your device, it should be available as a target when sharing any content from that device, e.g. a photo or a URL.

When you share something to your WordPress site, the installed PWA of your website should open. You should then (potentially after logging in) land directly on a new post in the block editor where the shared content has already been added. If you are sharing a media file (e.g. an image or video file), it will be automatically added to your site's media library.

## Background information

This plugin is powered by the Web Share Target API. The [Web Share Target API](https://web.dev/web-share-target/) is a modern browser API which allows sharing images, media, URLs and basic text content directly to your website, relying on the regular sharing UI that is for example integrated in your phone. [See here for more technical background information about the Web Share Target API.](https://w3c.github.io/web-share-target/)

## Third-party developer API

The Share Target plugin allows other plugins to integrate with it. You can customize what should happen with incoming shared content when it arrives in the block editor, conditionally overriding the default behavior of the plugin.

In PHP, enqueue your custom JavaScript file. Make sure to include the `share-target` script in its dependencies. For example:

```php
wp_enqueue_script(
  'my-share-target-handler',
  '/assets/js/my-share-target-handler.js',
  array( 'share-target' )
);
```

In your JavaScript file you can then add your custom share handler using the following function:

**`wp.shareTarget.registerShareHandler( options )`**

Registers a new share handler for incoming shared data.

Parameters:

* `options`: _(Object) (required)_ Handler options.
* `options.handle`: _(Function) (required)_ Share handler function. Must be asynchronous and accept an object with properties `title`, `description`, `link` (each strings), and `attachment` (object). Any of these may be undefined. Depending on the data, the function should decide whether to handle it and if so run the necessary logic and return true, to stop following handlers from being called. Otherwise, it should return false.
* `options.priority`: _(number) (optional)_ Priority for the handler. A lower number means higher priority, like for WordPress hooks. Default is 10.

The following example handles any shared Spotify content and embeds it into the post:

```js
// Matches a shared Spotify URL.
const spotifyRegex = /^https:\/\/open\.spotify\.com/;

wp.shareTarget.registerShareHandler( {
  handle: async ( { link, attachment } ) => {
    // Do not handle if a media file is being shared.
    if ( attachment ) {
      return false;
    }

    // If a shared Spotify URL, embed it.
    if ( link && link.match( spotifyRegex ) ) {
      wp.data.dispatch( 'core/block-editor' ).insertBlocks( [
        wp.blocks.createBlock( 'core/embed', {
          url: link,
          type: 'rich',
          providerNameSlug: 'spotify',
          responsive: true,
        } ),
      ] );
      return true;
    }

    // Otherwise fall back to other handlers.
    return false;
  },
  priority: 5,
} );
```

## Contributing

Any kind of contributions to Share Target are welcome. Please [read the contributing guidelines](https://github.com/felix-arntz/wp-share-target/blob/main/CONTRIBUTING.md) to get started.
