<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PlantFaq;

class PlantFaqController extends Controller
{
    public function getFaqs($plantId)
    {
        $faqs = PlantFaq::where('plant_id', $plantId)->get();
        return response()->json($faqs);
    }
}
