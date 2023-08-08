Create database Ezdeli
Drop database Ezdeli
use Ezdeli

Create Table _Order (
    order_id varchar(10) Primary key,
    sender nvarchar(255) not null,
    receiver nvarchar(255) not null,
    send_address varchar(255) not null,
    receive_address varchar(255) not null,
    order_at date,
    status varchar(255) not null

    Constraint CK_Order_Status Check (status in ('received', 'shipping', 'transiting', 'delivered'))
)

Create Table __Product_Type (
    type_id varchar(10) Primary Key,
    type_name nvarchar(255) not null
)

Create Table _Product (
    product_id varchar(10) primary key,
    type_id varchar(10),
    product_name nvarchar(255) not null,
    weight float not null,
    size nvarchar(255) not null,
    price int not null,
    
    Constraint FK_PRODUCT_TYPE Foreign Key (type_id) References __Product_Type (type_id),
)   

Create Table __Order_Detail (
    order_id varchar(10),
    product_id varchar(10),
    quantity int not null,
    price int not null,

    Primary Key (order_id, product_id),
    Constraint FK_ORDERDETAIL_ORDER Foreign Key (order_id) References _Order (order_id),
    Constraint FK_ORDERDETAIL_PRODUCT Foreign Key (product_id) References _Product (product_id)
)

Create Table _Warehouse (
    warehouse_id varchar(10) Primary key,
    warehouse_name nvarchar(255) not null,
    address varchar(255) not null
)

Create Table __Product_History (
    history_id varchar(10) Primary Key,
    product_id varchar(10) not null,
    import_date datetime,
    export_date datetime,
    status varchar(255) not null,
    warehouse_id varchar(10),

    Constraint FK_HISTORY_PRODUCT Foreign Key (product_id) References _Product (product_id),
    Constraint FK_HISTORY_WAREHOUSE Foreign Key (warehouse_id) References _Warehouse (warehouse_id)
)

Create Table _Vehicle (
    vehicle_id varchar(10) primary key,
    vehicle_type varchar(255) not null,
    vehicle_num varchar(255) not null,
    status varchar(255) not null default 'ready',

    Constraint CK_Vehicle_Status Check (status in ('ready', 'transiting', 'unready'))
)

Create Table _Driver (
    driver_id varchar(10) Primary key,
    name nvarchar(255) not null,
    contact_info nvarchar(255) not null,
    license_number varchar(255) not null,
    status varchar(255) not null 

    Constraint CK_Driver_Status CHeck (status in ('ready', 'busy', 'not working'))
)

Create Table _Route (
    route_id varchar(10) Primary key,
    start_point nvarchar(255) not null,
    end_point nvarchar(255) not null,
    distance int,
    time_estimate int

)

Create Table _Delivery (
    delivery_id varchar(10) Primary Key,
    order_id varchar(10),
    vehicle_id varchar(10),
    driver_id varchar(10),
    delivery_date datetime,
    delivery_time int,
    
    Constraint FK_Delivery_Order Foreign key (order_id) References _Order (order_id),
    Constraint FK_Delivery_Vehicle Foreign key (vehicle_id) References _Vehicle (vehicle_id),
    Constraint FK_Delivery_Driver foreign key (driver_id) References _Driver (driver_id)

)

Create Table _Schedule (
    schedule_id varchar(10) Primary key,
    vehicle_id varchar(10),
    driver_id varchar(10),
    transport_date datetime,
    start_time int,
    end_time int,

    Constraint FK_Schedule_Vehicle Foreign key (vehicle_id) References _Vehicle (vehicle_id),
    Constraint FK_Schedule_Driver Foreign key (driver_id) References _Driver (driver_id),
    Constraint CK_Start_End_Time Check (start_time < end_time)
)

Create Table _Transport (
    transport_id varchar(10) Primary key,
    created_at datetime,
    updated_at datetime,
    status varchar(255) not null,
    order_id varchar(10),

    Constraint FK_Transport_Order Foreign key (order_id) References _Order (order_id),
    Constraint CK_Transport_Status Check (status in ('shipping', 'delivered'))

)

Create Table _Manager (
    manager_id varchar(10) Primary key,
    name nvarchar(255) not null,
    contact_info nvarchar(255)
)


-- PROCEDURES VEHICLE --
Create Proc PROC_INSERT_VEHICLE @vehicle_id varchar(10), @vehicle_type varchar(255), @vehicle_num varchar(255), @status varchar(255)
As
    Insert Into _Vehicle
    Values (@vehicle_id, @vehicle_type, @vehicle_num, @status)


Create Proc PROC_UPDATE_VEHICLE @vehicle_id varchar(10), @vehicle_type varchar(255), @vehicle_num varchar(255), @status varchar(255)
As 
    Update _Vehicle
    Set vehicle_type = @vehicle_type, vehicle_num = @vehicle_num, status = @status
    Where vehicle_id = @vehicle_id

Create Proc PROC_DELETE_VEHICLE @vehicle_id varchar(10)
As
    Delete From _Vehicle Where vehicle_id = @vehicle_id


-- PROCEDURES DRIVER --
Create Proc PROC_INSERT_DRIVER @driver_id varchar(10), @name nvarchar(255), @contact_info nvarchar(255), @license_number varchar(255), @status varchar(255)
As
    Insert Into _Driver
    Values (@driver_id, @name, @contact_info, @license_number, @status)

Create Proc PROC_UPDATE_DRIVER @driver_id varchar(10), @name nvarchar(255), @contact_info nvarchar(255), @license_number varchar(255), @status varchar(255)
As
    Update _Driver
    Set name = @name, contact_info = @contact_info, license_number = @license_number, status = @status 
    Where driver_id = @driver_id

Create Proc PROC_DELETE_DRIVER @driver_id varchar(10)
As 
    Delete From _Driver Where driver_id = @driver_id


-- PROCEDURES PRODUCT TYPE --
Create Proc PROC_INSERT_PRODUCT_TYPE @type_id varchar(10), @type_name nvarchar(255)
As 
    Insert Into __Product_Type
    Values (@type_id, @type_name)

Create Proc PROC_UPDATE_PRODUCT_TYPE @type_id varchar(10), @type_name nvarchar(255)
As
    Update __Product_Type
    Set type_name = @type_name
    Where type_id = @type_id

Create Proc PROC_DELETE_PRODUCT_TYPE @type_id varchar(10)
As 
    Delete From __Product_Type Where type_id = @type_id

    
-- PROCEDURES PRODUCT --
Create Proc PROC_INSERT_PRODUCT @product_id varchar(10), @type_id varchar(10), @product_name nvarchar(255), @weight float, @size varchar(255), @price int 
As
    Insert into _Product 
    Values (@product_id, @type_id, @product_name, @weight, @size, @price)

Create Proc PROC_UPDATE_PRODUCT @product_id varchar(10), @type_id varchar(10), @product_name nvarchar(255), @weight float, @size varchar(255), @price int 
As
    Update _Product
    Set type_id = @type_id, product_id = @product_name, weight = @weight, size = @size, price = @price 
    Where product_id = @product_id

Create Proc PROC_DELETE_PRODUCT @product_id varchar(10)
As 
    Delete From _Product Where product_id = @product_id

