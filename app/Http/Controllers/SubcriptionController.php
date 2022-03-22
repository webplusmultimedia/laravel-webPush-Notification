<?php

    namespace App\Http\Controllers;

    use App\Notifications\PushDefaultNotification;
    use App\User;
    use Illuminate\Http\Request;
    use Illuminate\Support\Facades\Notification;

    class SubcriptionController extends Controller
    {
        public function key()
        {
            return [
                'key' => env('VAPID_PUBLIC_KEY')
            ];
        }

        public function subscribe(Request $request)
        {
            $this->validate($request, [
                'endpoint'    => 'required',
                'keys.auth'   => 'required',
                'keys.p256dh' => 'required'
            ]);
            $endpoint = $request->endpoint;
            $token = $request->keys['auth'];
            $key = $request->keys['p256dh'];
            $user = auth()->user();
            $user->updatePushSubscription($endpoint, $key, $token);

            return response()->noContent();
        }

        public function push()
        {
            Notification::send(auth()->user(), new PushDefaultNotification);

            return response()->json(['success' => true]);
        }
    }
