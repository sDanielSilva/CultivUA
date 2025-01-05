<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\KitReading;

class KitReadingController extends Controller
{
    public function getReadingsByKitId($kitId)
    {
        $readings = KitReading::where('kits_id', $kitId)->get();
        return response()->json($readings);
    }
}
