# Highlights of this project

- Project uses jsonresume schema https://jsonresume.org/schema/. You can use https://gitconnected.com/ to create your profile and expose your Resume as json.
- xtermjs is used for displaying the terminal

# How to install & run

- Clone the repo & run `npm install`
- This repo does not contain server code as its static content to be used in existing webserver. In local if you want to run, use a `http-server`
  - `npm install --global http-server`
  - `http-server ./ -p 8001`

# Customization

- Search for string `UPDATEME` in this repo and those are the easily customizable options
- For example, to Update name in the welcome message `WELCOME_NAME` variable in `index.js` needs to be updated.
- Replace the default resume path to your resume path by updating `RESUME_FILE_PATH` in `index.js`
- Update `PROFILE_IMAGE_AS_TEXT` in `index.js` to change the textual image displayed as `avatar`. To get textual image use https://www.text-image.com/convert/ascii.html or any similar site. Please append `\n` to end of each line so it can be properly split and displayed.

# How can the user navigate.

1. On landing display

   - The Portfolio image
   - The welcome message
   - List of commands available

2. List of commands

   - Help command
   - Display avatar again
   - Resume Sections
   - Limited grep command

3. Help command
   $ help command

   # The above command should show help for a command

   $ help

   # The above command should show the all the commands available with a summary

4. Option to display Avatar again
5. Resume Sections
   Each section of the resume must be paginated and colorized accordingly
6. grep command is limited in capacity. As such it allows to grep sections.
