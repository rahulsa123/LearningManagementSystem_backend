## Learning Management System

## heroku point

    https://desolate-dusk-62730.herokuapp.com/

## prerequisite

- in project folder<br>

```bash
  $ mkdir config
  $ touch config/default.json
```

- inside default.json set

```json
    {
    "jwtPrivateKey": private key,
    "db": mongodb url,
    "port": port number,
    "cloud_name": Cloudinary cloud name,
    "api_key": Cloudinary cloud api key,
    "api_secret": Cloudinary cloud api secrest
    }
```

### Api endpoint

#### GET /api/users

    return [{ user's information... }, { ...}]

#### POST /api/users

    must be multipart  Form data
    {
        name: required,
        email: required,
        password : required,
        image: required,
        phone_number : optional,
        about_me : optional,
        city : optional,
        country : optional,
        company : optional,
        school : optional,
        hometown : optional,
        languages : optional,
        gender : [["male", "Female", "others"], required],
        isfaculty: [Boolean, required],
    }

#### GET /api/users/:id

    {
     user's information
    }

#### PUT /api/users/:id

    must be multipart  Form data
    {
        name: updatable,
        email: not  updatable,
        password : updatable,
        image: updatable,
        phone_number : updatable,
        about_me : updatable,
        city : updatable,
        country : updatable,
        company : updatable,
        school : updatable,
        hometown : updatable,
        languages : updatable,
        gender : [["male", "Female", "others"], updatable],
        isfaculty: [Boolean, updatable],
    }

#### DELETE /api/users/:id

    header must conatains  valid x-auth-token

#### POST /api/login

    take {
        name:optional,
        email:required,
        password:required,
    }
    return {
        key: json web token
    }

#### GET /api/courses

    return [{ course's information... }, { ...}]

#### GET /api/courses/:id

    {
        id:id
        course's information...
    }

#### POST /api/courses

    only faculty can access
    {
        courseName: required,
        courseDept: required,
        description: required,
        courseRoom: required,
        waitlistCapacity: required,
        courseTeam: required
    }

#### GET /api/courses/byme

    only faculty can access
    return [{ course's information... }, { ...}]

#### GET /api/enrolled

    only authenticated user can access
    return [all enrolled course]

#### Post /api/enrolled

    only authenticated user can access
    take :{
        courseId : required
    }
