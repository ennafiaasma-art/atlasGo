<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminUserController extends Controller
{
   public function index()
    {
        $admins = User::where('role', 'admin')->get();

        return response()->json([
            'status' => 'success',
            'data' => $admins
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'admin', 
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Administrateur créé avec succès.',
            'data' => $user
        ], 201);
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Administrateur supprimé avec succès.'
        ]);
    }

    public function indexClients()
    {
        $clients= User::where('role', 'user')->get();

        return response()->json([
            'status' => 'success',
            'data' => $clients
        ]);
    }
}
