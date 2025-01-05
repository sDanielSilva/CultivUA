<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SupportTicket extends Model
{
    use HasFactory;

    /**
     * Campos preenchíveis.
     *
     * @var array
     */
    protected $fillable = [
        'user_id',
        'email',
        'subject',
        'message',
        'response',
        'status',
    ];

    /**
     * Relacionamento: cada ticket pertence a um user.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

}