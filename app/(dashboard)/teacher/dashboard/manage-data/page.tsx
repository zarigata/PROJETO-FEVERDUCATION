import { DashboardDataManager } from "@/components/dashboard-data-manager"

export default function ManageDashboardDataPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Manage Dashboard Data</h1>
        <p className="text-muted-foreground">Add, update, or reset data used in the dashboard charts</p>
      </div>

      <DashboardDataManager />

      <div className="mt-8 space-y-4">
        <h2 className="text-xl font-semibold">Documentation</h2>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Database Setup</h3>
            <p className="text-muted-foreground">The dashboard uses three tables in your Supabase database:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>
                <code>performance_data</code> - Stores monthly performance metrics
              </li>
              <li>
                <code>subject_data</code> - Stores data about different subjects
              </li>
              <li>
                <code>class_distribution</code> - Stores class distribution information
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium">Real-time Updates</h3>
            <p className="text-muted-foreground">
              The dashboard charts update automatically when data changes in the database. This is implemented using
              Supabase's real-time subscriptions.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium">Adding Data</h3>
            <p className="text-muted-foreground">
              Use the form above to add new data points to any of the three data categories. The charts will update in
              real-time as you add data.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium">Seeding Default Data</h3>
            <p className="text-muted-foreground">
              Click the "Seed Default Data" button to populate the database with sample data. This is useful for testing
              or resetting to a known state.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium">Clearing Data</h3>
            <p className="text-muted-foreground">
              The "Clear Data" button will remove all data from the selected table. Use with caution as this action
              cannot be undone.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
