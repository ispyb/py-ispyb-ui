# Developments


## Migration
The goal of this section is to write down the migration and the decision taken in order to update EXI2


### Major Changes

#### React

#### Create-react-app

`py-ispyb-ui` has been built from scracth by using [Create React App 5.0](https://github.com/facebook/create-react-app/releases/tag/v5.0.0)

This version updates the following dependencies:
- webpack 5 (#11201)
- Jest 27 (#11338)
- ESLint 8 (#11375)
- PostCSS 8 (#11121)
- Fast Refresh improvements and bug fixes (#11105)
- Support for Tailwind (#11717)
- Improved package manager detection (#11322)
- Unpinned all dependencies for better compatibility with other tools (#11474)
- Dropped support for Node 10 and 12

#### React-bootstrap 2.1.0

 - From react-bootstrap `0.33.1` to react-bootstrap `v2.1.0`
 - From bootstrap `3` to bootstrap `5` 


## Problems found

### react-hook-form

The latest version of this hook has changed the way the items of a form are registered.
From:
```
<FormControl inputRef={register({ required: true })} type="text" name="username" autoFocus required />
```
To:
```
 <FormControl {...register('password', { required: true })} type="password" name="password" required />
```
