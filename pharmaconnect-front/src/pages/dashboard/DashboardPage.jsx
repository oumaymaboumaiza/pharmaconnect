import React from 'react';
import { 
  FileText, 
  Package, 
  Users, 
  ShoppingCart, 
  AlertCircle,
  ArrowUpRight,
  Pill
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';

const DashboardPage = () => {
  const { user } = useAuth();
  const role = user?.role || 'STAFF';
  
  // Dashboard stats would normally be fetched from the backend
  const dashboardStats = {
    prescriptions: {
      total: 145,
      pending: 23,
    },
    inventory: {
      total: 412,
      lowStock: 18,
    },
    staff: {
      total: 24,
      active: 22,
    },
    orders: {
      total: 32,
      pending: 7,
    },
  };
  
  // Recent alerts - would be fetched from backend
  const recentAlerts = [
    { id: 1, title: 'Low stock alert', message: 'Amoxicillin 500mg is below reorder level', type: 'warning' },
    { id: 2, title: 'New prescription', message: 'Dr. Smith submitted a new prescription', type: 'info' },
    { id: 3, title: 'Order confirmed', message: 'Order #1234 was confirmed by supplier', type: 'success' },
  ];
  
  // Render different dashboard based on user role
  const renderRoleBasedContent = () => {
    switch (role) {
      case 'ADMIN':
        return renderAdminDashboard();
      case 'PHARMACY':
        return renderPharmacyDashboard();
      case 'DOCTOR':
        return renderDoctorDashboard();
      case 'SUPPLIER':
        return renderSupplierDashboard();
      default:
        return renderStaffDashboard();
    }
  };
  
  const renderAdminDashboard = () => (
    <>
      <div className="grid gap-6 mb-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Prescriptions" 
          value={dashboardStats.prescriptions.total.toString()} 
          subtitle={`${dashboardStats.prescriptions.pending} pending`}
          icon={<FileText size={24} />}
          iconColor="text-blue-500"
          iconBg="bg-blue-100"
        />
        <StatCard 
          title="Inventory Items" 
          value={dashboardStats.inventory.total.toString()} 
          subtitle={`${dashboardStats.inventory.lowStock} low stock`}
          icon={<Package size={24} />}
          iconColor="text-green-500"
          iconBg="bg-green-100"
        />
        <StatCard 
          title="Staff Members" 
          value={dashboardStats.staff.total.toString()} 
          subtitle={`${dashboardStats.staff.active} active`}
          icon={<Users size={24} />}
          iconColor="text-purple-500"
          iconBg="bg-purple-100"
        />
        <StatCard 
          title="Orders" 
          value={dashboardStats.orders.total.toString()} 
          subtitle={`${dashboardStats.orders.pending} pending`}
          icon={<ShoppingCart size={24} />}
          iconColor="text-amber-500"
          iconBg="bg-amber-100"
        />
      </div>
      
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAlerts.map(alert => (
                <AlertItem 
                  key={alert.id} 
                  title={alert.title} 
                  message={alert.message} 
                  type={alert.type} 
                />
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 grid-cols-2">
              <Button variant="primary" leftIcon={<Users size={18} />}>
                Manage Users
              </Button>
              <Button variant="outline" leftIcon={<FileText size={18} />}>
                View Reports
              </Button>
              <Button variant="outline" leftIcon={<Package size={18} />}>
                Inventory
              </Button>
              <Button variant="outline" leftIcon={<ShoppingCart size={18} />}>
                Orders
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
  
  const renderPharmacyDashboard = () => (
    <>
      <div className="grid gap-6 mb-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Prescriptions" 
          value={dashboardStats.prescriptions.total.toString()} 
          subtitle={`${dashboardStats.prescriptions.pending} pending`}
          icon={<FileText size={24} />}
          iconColor="text-blue-500"
          iconBg="bg-blue-100"
        />
        <StatCard 
          title="Inventory Items" 
          value={dashboardStats.inventory.total.toString()} 
          subtitle={`${dashboardStats.inventory.lowStock} low stock`}
          icon={<Package size={24} />}
          iconColor="text-green-500"
          iconBg="bg-green-100"
        />
        <StatCard 
          title="Staff Members" 
          value={dashboardStats.staff.total.toString()} 
          subtitle={`${dashboardStats.staff.active} active`}
          icon={<Users size={24} />}
          iconColor="text-purple-500"
          iconBg="bg-purple-100"
        />
        <StatCard 
          title="Orders" 
          value={dashboardStats.orders.total.toString()} 
          subtitle={`${dashboardStats.orders.pending} pending`}
          icon={<ShoppingCart size={24} />}
          iconColor="text-amber-500"
          iconBg="bg-amber-100"
        />
      </div>
      
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Low Stock Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <LowStockItem name="Amoxicillin 500mg" current={12} reorderLevel={20} />
              <LowStockItem name="Lisinopril 10mg" current={8} reorderLevel={15} />
              <LowStockItem name="Metformin 850mg" current={5} reorderLevel={25} />
            </div>
            <div className="mt-4">
              <Button variant="outline" size="sm" fullWidth>View All Inventory</Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Recent Prescriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <PrescriptionItem 
                patient="John Smith" 
                doctor="Dr. Sarah Johnson" 
                date="Today at 2:30 PM" 
                status="pending"
              />
              <PrescriptionItem 
                patient="Emily Davis" 
                doctor="Dr. Mark Wilson" 
                date="Yesterday at 10:15 AM" 
                status="filled"
              />
              <PrescriptionItem 
                patient="Michael Brown" 
                doctor="Dr. Jennifer Lee" 
                date="Oct 12, 2023" 
                status="completed"
              />
            </div>
            <div className="mt-4">
              <Button variant="outline" size="sm" fullWidth>View All Prescriptions</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
  
  const renderDoctorDashboard = () => (
    <>
      <div className="grid gap-6 mb-8 grid-cols-1 md:grid-cols-3">
        <StatCard 
          title="Prescriptions Written" 
          value="87" 
          subtitle="12 this week"
          icon={<FileText size={24} />}
          iconColor="text-blue-500"
          iconBg="bg-blue-100"
        />
        <StatCard 
          title="Patients" 
          value="156" 
          subtitle="3 new this week"
          icon={<Users size={24} />}
          iconColor="text-purple-500"
          iconBg="bg-purple-100"
        />
        <StatCard 
          title="Medications Prescribed" 
          value="312" 
          subtitle="Most common: Amoxicillin"
          icon={<Pill size={24} />}
          iconColor="text-green-500"
          iconBg="bg-green-100"
        />
      </div>
      
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Recent Prescriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <PrescriptionItem 
                patient="John Smith" 
                doctor="You" 
                date="Today at 2:30 PM" 
                status="pending"
              />
              <PrescriptionItem 
                patient="Emily Davis" 
                doctor="You" 
                date="Yesterday at 10:15 AM" 
                status="filled"
              />
              <PrescriptionItem 
                patient="Michael Brown" 
                doctor="You" 
                date="Oct 12, 2023" 
                status="completed"
              />
            </div>
            <div className="mt-4">
              <Button variant="primary" size="sm" fullWidth>Write New Prescription</Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <AppointmentItem 
                patient="Sarah Johnson" 
                time="Today, 4:30 PM" 
                reason="Follow-up"
              />
              <AppointmentItem 
                patient="Robert Williams" 
                time="Tomorrow, 10:00 AM" 
                reason="Annual checkup"
              />
              <AppointmentItem 
                patient="Lisa Anderson" 
                time="Oct 15, 9:15 AM" 
                reason="Consultation"
              />
            </div>
            <div className="mt-4">
              <Button variant="outline" size="sm" fullWidth>View Full Schedule</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
  
  const renderSupplierDashboard = () => (
    <>
      <div className="grid gap-6 mb-8 grid-cols-1 md:grid-cols-3">
        <StatCard 
          title="Open Orders" 
          value="18" 
          subtitle="5 new this week"
          icon={<ShoppingCart size={24} />}
          iconColor="text-amber-500"
          iconBg="bg-amber-100"
        />
        <StatCard 
          title="Completed Orders" 
          value="243" 
          subtitle="28 this month"
          icon={<Package size={24} />}
          iconColor="text-green-500"
          iconBg="bg-green-100"
        />
        <StatCard 
          title="Client Pharmacies" 
          value="15" 
          subtitle="2 new this month"
          icon={<Users size={24} />}
          iconColor="text-blue-500"
          iconBg="bg-blue-100"
        />
      </div>
      
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <OrderItem 
                orderId="ORD-1234" 
                pharmacy="City Pharmacy" 
                date="Today at 11:45 AM" 
                status="pending"
                items={4}
                total="$578.60"
              />
              <OrderItem 
                orderId="ORD-1233" 
                pharmacy="MediPlus Pharmacy" 
                date="Yesterday at 3:20 PM" 
                status="confirmed"
                items={7}
                total="$1,245.30"
              />
              <OrderItem 
                orderId="ORD-1232" 
                pharmacy="HealthCare Drugs" 
                date="Oct 10, 2023" 
                status="delivered"
                items={2}
                total="$324.75"
              />
            </div>
            <div className="mt-4">
              <Button variant="outline" size="sm" fullWidth>View All Orders</Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <TopProductItem 
                name="Amoxicillin 500mg" 
                orders={45} 
                revenue="$3,456.80"
                trend="+12%"
              />
              <TopProductItem 
                name="Metformin 850mg" 
                orders={38} 
                revenue="$2,890.50"
                trend="+8%"
              />
              <TopProductItem 
                name="Lisinopril 10mg" 
                orders={32} 
                revenue="$2,345.20"
                trend="+5%"
              />
            </div>
            <div className="mt-4">
              <Button variant="outline" size="sm" fullWidth>View Product Catalog</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
  
  const renderStaffDashboard = () => (
    <div className="grid gap-6 grid-cols-1">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to PharmaConnect</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            You're logged in as a staff member. Your manager will assign you specific tasks and permissions.
          </p>
          <Button variant="primary">View My Tasks</Button>
        </CardContent>
      </Card>
    </div>
  );
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.name || 'User'}!</p>
      </div>
      
      {renderRoleBasedContent()}
    </div>
  );
};

// Helper components for dashboard cards

const StatCard = ({ title, value, subtitle, icon, iconColor, iconBg }) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center">
        <div className={`${iconBg} ${iconColor} p-3 rounded-full mr-4`}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const AlertItem = ({ title, message, type }) => {
  const getAlertStyles = () => {
    switch (type) {
      case 'warning':
        return 'bg-amber-50 border-amber-200 text-amber-800';
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };
  
  return (
    <div className={`p-3 rounded border ${getAlertStyles()}`}>
      <div className="flex items-start">
        <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-medium">{title}</h4>
          <p className="text-sm opacity-90">{message}</p>
        </div>
      </div>
    </div>
  );
};

const LowStockItem = ({ name, current, reorderLevel }) => {
  const percentage = (current / reorderLevel) * 100;
  
  return (
    <div className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
      <div className="flex justify-between items-center mb-1">
        <span className="font-medium">{name}</span>
        <span className="text-sm text-red-600 font-medium">{current} of {reorderLevel}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full ${percentage < 25 ? 'bg-red-600' : 'bg-amber-500'}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

const PrescriptionItem = ({ patient, doctor, date, status }) => {
  const getStatusBadge = () => {
    switch (status) {
      case 'pending':
        return <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">Pending</span>;
      case 'filled':
        return <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Filled</span>;
      case 'completed':
        return <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Completed</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">{status}</span>;
    }
  };
  
  return (
    <div className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
      <div className="flex justify-between">
        <div>
          <p className="font-medium">{patient}</p>
          <p className="text-sm text-gray-500">By {doctor}</p>
        </div>
        <div className="text-right">
          {getStatusBadge()}
          <p className="text-xs text-gray-500 mt-1">{date}</p>
        </div>
      </div>
    </div>
  );
};

const AppointmentItem = ({ patient, time, reason }) => {
  return (
    <div className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
      <div className="flex justify-between">
        <div>
          <p className="font-medium">{patient}</p>
          <p className="text-sm text-gray-500">{reason}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium">{time}</p>
        </div>
      </div>
    </div>
  );
};

const OrderItem = ({ orderId, pharmacy, date, status, items, total }) => {
  const getStatusBadge = () => {
    switch (status) {
      case 'pending':
        return <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">Pending</span>;
      case 'confirmed':
        return <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Confirmed</span>;
      case 'shipped':
        return <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">Shipped</span>;
      case 'delivered':
        return <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Delivered</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">{status}</span>;
    }
  };
  
  return (
    <div className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
      <div className="flex justify-between">
        <div>
          <p className="font-medium">{orderId}</p>
          <p className="text-sm text-gray-500">{pharmacy}</p>
        </div>
        <div className="text-right">
          {getStatusBadge()}
          <p className="text-xs text-gray-500 mt-1">{date}</p>
        </div>
      </div>
      <div className="mt-2 flex justify-between text-sm">
        <span>{items} items</span>
        <span className="font-medium">{total}</span>
      </div>
    </div>
  );
};

const TopProductItem = ({ name, orders, revenue, trend }) => {
  return (
    <div className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
      <div className="flex justify-between">
        <div>
          <p className="font-medium">{name}</p>
          <p className="text-sm text-gray-500">{orders} orders</p>
        </div>
        <div className="text-right">
          <p className="font-medium">{revenue}</p>
          <p className="text-sm text-green-600 flex items-center justify-end">
            {trend} <ArrowUpRight size={14} className="ml-1" />
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;