
# Project Attendance




## API Reference
Import collection dan environment postman yang ada di folder postman, dan jangan lupa untuk mengatur environment sebelum menggunakan collection

Seluruh Endpoint memerlukan _Bearer <Token>_ untuk mengaksesnya kecuali _Auth Route_

### 1. Auth Route

#### a. Register User
Setelah melakukan registrasi kamu tidak perlu melakukan login karena accessToken akan mengenerate dan tersimpan secara otomatis di Postman

Jika role tidak ditulis pada body request role maka akan default menjadi _employee_

```http
  POST /register
```

| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `fullname` | `string` | **Required**.  |
| `email` | `string` | **Required**.  |
| `password` | `string` | **Required**.  |
| `role` | `enum` | _employee, manager_ |

#### b. Login User
```http
  POST /login
```

| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email` | `string` | **Required**.  |
| `password` | `string` | **Required**.  |

#### c. Refresh Token
Jika access token kadaluarsa kamu dapat menggunakan endpoint ini untuk mendapatkan access token baru
```http
  POST /refresh-token
```

| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `refreshToken` | `string` | **Required**.  |

### 2. User Route

#### List User
Endpoint yang hanya bisa diakses user dengan role _manager_ untuk mendapatkan list data user

```http
  POST /users
```

### 3. Attendance Route

#### a. Get All Self Attendance
Endpoint untuk mendapatkan list attendance yang dimiliki oleh user

```http
  GET /user/attendance
```

#### b. Get User Attendance by Id
Hanya bisa diakses oleh role _manager_ untuk mendapatkan list attendance user lain
```http
  GET /user/${id}/attendance
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `string` | **Required**. id of user |


#### c. Store
Endpoint untuk melakukan proses checkin oleh user
```http
  POST /user/attendance
```

| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `checkInTime` | `datetime` | **Required**. gunakan UTC format "2023-06-16T07:30:00Z" |

#### d. Update
Endpoint untuk melakukan proses checkout oleh user
```http
  PUT /user/attendance/${id}
```

| Parameter | Type | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `string` | **Required**. Id of attendance to update" |

Sedangkan untuk body request yang diperlukan

| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `checkOutTime` | `datetime` | **Required**. gunakan UTC format "2023-06-16T17:30:00Z" |

### 4. Permit Route

#### a. Get All Permit Request
Endpoint untuk mendapatkan seluruh request permit yang diajukan oleh employee, endpoint ini hanya bisa digunakan oleh _manager_

Jika query parameter tidak diberikan maka endpoint akan mengembalikan seluruh permit status

```http
  GET /pemit?permit_state=submitted
```

| Query | Type | Description                |
| :-------- | :------- | :------------------------- |
| `permit_state` | `enum` | _submitted, approved, rejected_ |

#### b. Get All Self Permit Request
Endpoint ini mengembalikan list request permit yang dimiliki oleh employee. 

Jika query parameter tidak diberikan maka endpoint akan mengembalikan seluruh permit status

```http
  GET /user/pemit?permit_state=submitted
```

| Query | Type | Description                |
| :-------- | :------- | :------------------------- |
| `permit_state` | `enum` | _submitted, approved, rejected_ |

#### c. Get Permit Request by Id Permit
Endpoint ini mengembalikan request permit berdasarkan Id Permit 

Jika role _manager_ akan mengembalikan permit request. Sedangkan jika role _employee_ endpoint hanya akan mengembalikan data yang dimilikinya

```http
  GET /user/pemit/${id}
```

| Parameter | Type | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `string` | **Required**. Id of permit to show |

#### d. Store Permit Request
Endpoint ini hanya bisa digunakan oleh role _employee_ untuk mengajukan permit request

Permit request hanya bisa diajukan ketika tidak ada antrian permit lainnya pada tanggal yang sama atau masih dalam proses persetujuan oleh _manager_

Permit request juga tidak bisa diajukan jika diantara tanggal tersebut terdapat Permit request yang telah disetujui

Dapat mengajukan Permit kembali ketika permit sebelumnya ditolak

```http
  POST /user/pemit
```

| Body | Type | Description                |
| :-------- | :------- | :------------------------- |
| `permitInfo` | `string` | **Required**. Reasons for taking permission |
| `permitType` | `enum` | **Required**. option: _permission, onLeave, sick_ |
| `startDate` | `date` | **Required**. gunakan format "2023-06-16"  |
| `endDate` | `date` | **Required**. gunakan format "2023-06-17"  |

#### e. Update Permit Request
Endpoint ini hanya bisa digunakan oleh role _manager_ untuk menyetujui atau menolak permit request _employee_

Jika _manager_ menyetujuinya maka sistem akan mengenerate otomatis absensi izin user dari tanggal awal hingga akhir izin

Permit yang telah disetujui maupun ditolak tidak dapat diubah kembali

```http
  PUT /user/pemit
```

| Body | Type | Description                |
| :-------- | :------- | :------------------------- |
| `permitState` | `enum` | **Required**. option: _approved, rejected_ |

### 4. Report Route

#### Generate Report
Endpoint ini hanya bisa digunakan oleh _manager_ yang akan mengembalikan list employee beserta jumlah telat, sakit, tidak hadir, jumlah cuti dan izin disetujui dan tidak disetujui

```http
  POST /reports
```

| Body | Type | Description                |
| :-------- | :------- | :------------------------- |
| `startDate` | `date` | **Required**. gunakan format "2023-06-1"  |
| `endDate` | `date` | **Required**. gunakan format "2023-06-30"  |