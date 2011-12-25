# YoMobi

[YoMobi](http://www.yomobi.com) is a mobile website builder that aims to be generic enough to fit many use cases.

YoMobi is built using Ruby 1.9.2, Rails 3.0.8, generic ActiveRecord (i.e. no db-specific sql), and CouchDB 1.1.1.

## Overview

YoMobi involves three main parties: The **website**, the **user**, and the **user generated [mobile] website** (UGW).

### The Website

The website consists of three parts: the mobile **builder**, the mobile **emulator**, and the **user admin interface**.

The **builder** is the interface that the user uses to manipulate the UGW. The **emulator** previews the UGW within the builder interface. The **user admin interface** lets the user do all other behind-the-scenes actions, such as email/texting his followers, or editing his account credentials.

### The User

The user is the one who registers an account at yomobi.com. The user uses the mobile **builder** to create his UGW, and uses the mobile **emulator** to view his work.

### The Mobile Visitor

The mobile visitor visits a UWG (usually by a redirect) from a mobile device. Visiting the UWG is typically the only interaction a mobile visitor will have with YoMobi.

## Development Environment Setup

### First time setup

    $ git clone git@github.com:onaseef/yomobi.git
    $ cd yomobi.git
    $ bundle install

### Environment Variables

These variables must be in your development environment:

#### `GOOGLE_API_KEY`

> A Google url shortener api key.

#### `S3_KEY`
    
> Your Amazon S3 public access key. **Note**: 

#### `S3_SECRET`

> Your Amazon S3 secret access key.

#### `SES_KEY` (optional, dev only)

> Your Amazon S3 public access key for emails. Defaults to the `S3_KEY` environment variable.

#### `SES_SECRET` (optional, dev only)

> Your Amazon S3 secret access key for emails. Defaults to the `S3_SECRET` environment variable.

#### `ARITCAPTCHA_S3_BUCKET`

> The bucket name on your Amazon S3 account to use for caching generated aritcaptcha images.

#### `LOGO_S3_BUCKET`

> The bucket name on your Amazon S3 account to use for company logos (now called "site photos" in the front end).

#### `COUCH_HOST`

> The CouchDB url to use for public mobile website data. Example: `yomobi.iriscouch.com`

#### `COUCH_ADMIN_USER`

> The admin username to your CouchDB server.

#### `COUCH_ADMIN_PASS`

> The admin password to your CouchDB server.

#### `DEVISE_URL_HOST` (optional)

> The base url Devise will use for opt-out urls. Default: `http://local.host:3000`

#### `ACTION_MAILER_HOST` (optional)

> The host ActionMailer will use for urls. Default: `local.host:3000`


# Development Overview

## Data Locations

- YoMobi user data is stored in SQL.
- Public UGW data is stored in CouchDB.
    - Each widget is contained within its own doc with a unique `_id`.
        - Naturally, widgets have no schema.
    - UGW meta data is stored in the `meta` doc.
        - `worder` - A map of widget ordering.
        - `wtabs ` - An array of widgets set as the UGW navigation tabs.

## The User Generated [Mobile] Website (UGW)

For an example in action, visit [yomobi.com/yomobi](http://www.yomobi.com/yomobi)

### HTML / Templates

- `views/shared/_mobile-render.slim` - Template layout for the mobile view skeleton.
- `views/shared/_templates.slim` - Templates for site info, nav bar, etc., as well as all widget pages.
- `views/shared/_category-templates.slim` - Item templates for different Category widget subtypes.

### Code Flow

1. `views/layouts/mobile.slim` - The entry point on page load.
2. All widgets and mobile js code is loaded.
3. The global MobileAppView is created, as well as its router (called "Controller" in this older version of backbone).
4. The UGW meta doc and widget docs are fetched from the public couch.
5. For each widget doc, its corresponding backbone view gets created and added to the global view.
6. The UGW home view is rendered.

## The Builder

Sign in and visit [yomobi.com/builder/main](http://www.yomobi.com/builder/main) to see this page.

### Templates

- `views/builder/_templates.slim` - Most builder-specific templates that are not needed in the UGW.
- `views/builder/_cat-dialog-templates.slim` - Templates for creating new nodes in Category widgets.

### Code Flow

1. `views/layouts/builder.slim` - The entry point on page load.
2. `views/builder/index.slim` - The layout html for the builder index page.
  1. The sidebar is loaded.
  2. The global MobileAppView is loaded, then extended in `builder-app.js`.
  3. The global BuilderAppView is loaded.
3. All widgets and mobile js code are loaded.
4. **All widget builder extensions and builder js code are loaded.**


## Widgets

Each widget **type** (not subtype) requires its own js file in `javascripts/widgets/mobile/`. All widgets extend `widgets/mobile/base.js`. On the builder page, the base widget is extended with builder-specific code in `widgets/builder/base.js`.

See `/lib/couch-docs.rb` for all widgets types and their respective meta-data (most of this data probably belongs in several of its own json files).

Widget initial data and meta data are loaded in `views/shared/_data-loader.html.erb` and `views/shared/_mobile-data-loader.html.erb`.

### Types

- Widget types (`wtype`) are unique, but multiple widget subtypes (`wsubtype`) can extend off a single `wtype`.
  - You can consider a `wsubtype` as a front-end name to its `wtype`

- Mobile widget js files can be extended in `javascripts/widgets/builder/` to make things easier for the widget editor.

- If a widget has property `singleton == true`, only one of that widget type/subtype combo can be in a UGW at one time.

### Mobile Views

The generic `WidgetPageView` is declared in `widgets/mobile/base.js`. This can be extended in a specific widget's js file, such as in `widgets/mobile/leave_msg.js`.

A widget's mobile page template is always located in `views/shared/_templates.slim`.

### Widget Editor Views (located in builder page)

The generic `EditWidgetView` is declared in `javascripts/views/edit-widget.js`. This is what you see when you click on a widget in the emulator on the builder page. This can be extended in a specific widget's js file, such as in `widgets/mobile/gmap.js`.

A widget's editor template is always located in `views/builder/_templates.slim`.
