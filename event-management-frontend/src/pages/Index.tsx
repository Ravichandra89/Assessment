import { EventsList } from "../components/EventsList";
import { CreateEventForm } from "../components/CreateEventForm";
import { ProfileSelector } from "../components/ProfileSelector";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Event Management</h1>
              <p className="text-muted-foreground">
                Create and manage events across multiple timezones
              </p>
            </div>
            <ProfileSelector />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <CreateEventForm />
          <EventsList />
        </div>
      </div>
    </div>
  );
};

export default Index;
